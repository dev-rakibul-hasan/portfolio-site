import type { Metadata } from "next";
import { Mail, Phone, Github, Linkedin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information and social links.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactItems = [
    settings.email && {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    settings.phone && {
      icon: Phone,
      label: "Phone",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s+/g, "")}`,
    },
    settings.github && {
      icon: Github,
      label: "GitHub",
      value: settings.github.replace(/^https?:\/\//, ""),
      href: settings.github,
    },
    settings.linkedin && {
      icon: Linkedin,
      label: "LinkedIn",
      value: settings.linkedin.replace(/^https?:\/\//, ""),
      href: settings.linkedin,
    },
    settings.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: settings.whatsapp,
      href: `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`,
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    label: string;
    value: string;
    href: string;
  }[];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <section className="glass rounded-3xl p-8">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Reach out via any of the channels below.
        </p>

        <ul className="mt-6 space-y-3">
          {contactItems.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]/50 px-5 py-4 text-sm transition-all hover:border-[var(--brand)]/50 hover:bg-[var(--brand)]/5 hover:text-[var(--brand)] group"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--brand)] group-hover:border-[var(--brand)]/40 group-hover:shadow-[0_0_14px_rgba(68,175,255,0.25)] transition-all">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                    {label}
                  </p>
                  <p className="mt-0.5 truncate font-medium text-[var(--text)]">
                    {value}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <ContactForm />
    </div>
  );
}
