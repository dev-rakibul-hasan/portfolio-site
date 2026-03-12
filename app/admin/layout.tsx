import Link from "next/link";
import { getServerSupabase } from "@/lib/supabase/server";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Tools", href: "/admin/tools" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Settings", href: "/admin/settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = getServerSupabase();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <section className="space-y-4">
      {/* Top bar */}
      <div className="glass rounded-2xl p-3 sm:p-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar -mx-1 px-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-xl border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="text-[10px] sm:text-xs text-[var(--muted)] border-t border-[var(--line)] sm:border-0 pt-3 sm:pt-0">
            {user ? (
              <span>Signed in as <strong>{user.email}</strong></span>
            ) : (
              <span>
                Not authenticated &mdash;{" "}
                <Link className="text-[var(--brand)] underline" href="/admin/login">
                  Login
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
