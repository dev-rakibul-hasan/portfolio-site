import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function SocialLinks({ settings }: { settings: SiteSettings }) {
  const links = [
    settings.github && { label: "GitHub", href: settings.github },
    settings.linkedin && { label: "LinkedIn", href: settings.linkedin },
    settings.email && { label: "Email", href: `mailto:${settings.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {links.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          target={item.href.startsWith("mailto") ? undefined : "_blank"}
          rel="noreferrer"
          className="glass rounded-xl px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--brand)]"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
