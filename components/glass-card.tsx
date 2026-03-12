import Link from "next/link";

export function GlassCard({ title, subtitle, href }: { title: string; subtitle: string; href: string }) {
  return (
    <Link href={href} className="glass rounded-2xl p-6 transition hover:-translate-y-0.5">
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
    </Link>
  );
}
