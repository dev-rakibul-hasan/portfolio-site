"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Globe, Rocket, Terminal } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const iconMap: Record<string, any> = {
  python: Terminal,
  javascript: Code2,
  "next.js": Globe,
  django: Globe,
  "ai agents": Cpu,
  automation: Rocket,
};

export function AboutPreview({ settings }: { settings: SiteSettings }) {
  const skillList = settings.skills.split(",").map(s => s.trim());
  const focusPoints = settings.core_focus.split(",").map(p => p.trim());

  return (
    <section id="home-about" className="mt-16 grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2">
      {/* Main About Card (Takes up 2x2 on large screens) */}
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass group relative overflow-hidden rounded-[2rem] p-6 sm:p-8 md:col-span-3 lg:col-span-2 lg:row-span-2"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-[60px] transition-all duration-500 group-hover:bg-brand/20 group-hover:blur-[80px]" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">About Me</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {settings.about_me}
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted/80">
            {settings.about_description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {skillList.map((skill) => {
              const Icon = iconMap[skill.toLowerCase()] || Code2;
              return (
                <span 
                  key={skill} 
                  className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-brand/50 hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      </motion.article>

      {/* What I Do Card */}
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass group relative overflow-hidden rounded-[2rem] p-8 md:col-span-1 lg:col-span-2 lg:row-span-1"
      >
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-teal-500/10 blur-[50px] transition-all duration-500 group-hover:bg-teal-500/20" />
        
        <div className="relative z-10 h-full flex flex-col justify-center">
          <h3 className="text-2xl font-semibold tracking-tight">Core Focus</h3>
          <ul className="mt-5 space-y-4">
            {focusPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-brand shadow-glow" />
                <span className="text-muted leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.article>

      {/* Tech Stack Visual Card */}
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass relative overflow-hidden rounded-[2rem] p-8 md:col-span-3 lg:col-span-2 lg:row-span-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-brand/5"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 text-center">
          <Terminal className="mx-auto h-12 w-12 text-brand/50 mb-4" />
          <p className="font-mono text-sm text-brand">{"<Building The Future />"}</p>
        </div>
      </motion.article>
    </section>
  );
}
