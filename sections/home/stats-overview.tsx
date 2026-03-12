"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FolderGit2, Blocks, Newspaper, ArrowUpRight } from "lucide-react";

export function StatsOverview({
  projectCount,
  toolCount,
  postCount,
}: {
  projectCount: number;
  toolCount: number;
  postCount: number;
}) {
  const stats = [
    {
      title: "Projects",
      count: projectCount,
      subtitle: "live items",
      href: "/projects",
      icon: FolderGit2,
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-cyan-500",
    },
    {
      title: "SaaS Tools",
      count: toolCount,
      subtitle: "utility apps",
      href: "/tools",
      icon: Blocks,
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      title: "Blog Posts",
      count: postCount,
      subtitle: "published stories",
      href: "/blog",
      icon: Newspaper,
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/80">Proof Points</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Selected numbers from the work</h2>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-right">
          A quick view of shipped work, tools, and published writing that support the portfolio with real output.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={stat.href}
              className="glass group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-7 transition-all hover:-translate-y-1 hover:shadow-glass-light dark:hover:shadow-glass"
            >
              <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${stat.color} blur-[40px] transition-all duration-500 group-hover:scale-150`} />

              <div className="relative z-10 flex items-center justify-between">
                <div className={`rounded-xl border border-border/50 bg-background/50 p-3 shadow-sm backdrop-blur-md ${stat.iconColor}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted opacity-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100 text-foreground" />
              </div>

              <div className="relative z-10 mt-10 space-y-3">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-bold tracking-tight text-foreground">{stat.count}</span>
                  <span className="pb-1 text-lg font-medium text-foreground/80">{stat.title}</span>
                </div>
                <p className="text-sm text-muted">{stat.subtitle}</p>
              </div>

              <div className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-brand/70">Explore</div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-brand to-transparent transition-all duration-500 group-hover:w-full" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
