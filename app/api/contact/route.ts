import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAdminSupabase } from "@/lib/supabase/admin";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

async function forwardContactToGmail(payload: ContactPayload) {
  const smtpUser = process.env.GMAIL_SMTP_USER;
  const smtpPassword = process.env.GMAIL_SMTP_APP_PASSWORD;
  const forwardTo = process.env.CONTACT_FORWARD_TO_GMAIL ?? smtpUser;

  if (!smtpUser || !smtpPassword || !forwardTo) {
    console.warn(
      "Contact email forwarding is disabled. Missing GMAIL_SMTP_USER, GMAIL_SMTP_APP_PASSWORD, or CONTACT_FORWARD_TO_GMAIL.",
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  await transporter.sendMail({
    from: `Portfolio Contact <${smtpUser}>`,
    to: forwardTo,
    replyTo: payload.email,
    subject: `New contact message from ${payload.name}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      "",
      "Message:",
      payload.message,
    ].join("\n"),
  });

  return true;
}

export async function POST(request: Request) {
  const rawPayload = await request.json();
  const payload: ContactPayload = {
    name: String(rawPayload?.name ?? "").trim(),
    email: String(rawPayload?.email ?? "").trim(),
    message: String(rawPayload?.message ?? "").trim(),
  };

  if (!payload?.name || !payload?.email || !payload?.message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase server config is missing." }, { status: 500 });
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: payload.name,
    email: payload.email,
    message: payload.message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let forwardedToGmail = false;
  try {
    forwardedToGmail = await forwardContactToGmail(payload);
  } catch (mailError) {
    console.error("Failed to forward contact message to Gmail:", mailError);
  }

  return NextResponse.json({ success: true, forwardedToGmail }, { status: 201 });
}
