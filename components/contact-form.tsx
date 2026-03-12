"use client";

import { FormEvent, useState } from "react";

type ContactStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({ error: "Unable to send message." }));
      setStatus("error");
      setMessage(result.error ?? "Unable to send message.");
      return;
    }

    setStatus("success");
    setMessage("Message sent successfully.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-3xl p-6 sm:p-8">
      <h2 className="text-2xl">Send Message</h2>
      <div className="mt-4 space-y-3">
        <input
          name="name"
          required
          placeholder="Your name"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
        />
        <input
          name="email"
          required
          type="email"
          placeholder="Your email"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
        />
        <textarea
          name="message"
          required
          placeholder="Your message"
          rows={5}
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send"}
      </button>
      {message ? <p className="mt-3 text-sm text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}
