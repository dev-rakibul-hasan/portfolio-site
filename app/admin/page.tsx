import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage projects, tools, blog, and site settings.",
};

const sections = [
  {
    title: "Projects",
    description: "Add, edit, and delete portfolio projects.",
    href: "/admin/projects",
  },
  {
    title: "Certificates",
    description: "Manage certifications, issue dates, verification links, and timeline flags.",
    href: "/admin/certificates",
  },
  {
    title: "SaaS Tools",
    description: "Manage tool listings, slugs, and descriptions.",
    href: "/admin/tools",
  },
  {
    title: "Blog Posts",
    description: "Create articles, edit content, and remove posts.",
    href: "/admin/blog",
  },
  {
    title: "Site Settings",
    description: "Update hero text, social links, and contact info.",
    href: "/admin/settings",
  },
  {
    title: "Contact Messages",
    description: "View and manage incoming inquiries from your visitors.",
    href: "/admin/contacts",
  },
];

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Admin Dashboard</h1>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="glass rounded-2xl p-5">
          <p className="text-sm text-[var(--muted)]">Total Projects</p>
          <p className="mt-1 text-3xl font-semibold">{stats.projects}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-sm text-[var(--muted)]">Total Tools</p>
          <p className="mt-1 text-3xl font-semibold">{stats.tools}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-sm text-[var(--muted)]">Certificates</p>
          <p className="mt-1 text-3xl font-semibold">{stats.certificates}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-sm text-[var(--muted)]">Blog Posts</p>
          <p className="mt-1 text-3xl font-semibold">{stats.blogPosts}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-sm text-[var(--muted)]">Messages</p>
          <p className="mt-1 text-3xl font-semibold">{stats.messages}</p>
        </div>
      </section>

      {/* Management sections */}
      <section className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="glass rounded-2xl p-6 transition hover:-translate-y-0.5"
          >
            <h2 className="text-2xl">{section.title}</h2>
            <p className="mt-3 text-[var(--muted)]">{section.description}</p>
            <p className="mt-4 text-xs font-semibold text-[var(--brand)]">Manage &rarr;</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
