"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const cardRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [enableTilt, setEnableTilt] = useState(false);
  const stack = project.tech_stack
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const displayStack = stack.slice(0, 3);
  const releaseYear = new Date(project.created_at).getFullYear();

  // Mouse transformation for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (reduceMotion) {
      setEnableTilt(false);
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const update = () => setEnableTilt(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [reduceMotion]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current || !enableTilt) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize values to -0.5 to 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={enableTilt ? handleMouseMove : undefined}
      onMouseLeave={enableTilt ? handleMouseLeave : undefined}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={enableTilt ? { y: -6, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="glass group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem]"
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/projects/${project.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/projects/${project.id}`);
        }
      }}
    >
      <div className="relative h-52 w-full shrink-0 overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#041220] via-[#041220]/35 to-transparent" />
        <Image src={project.image_url} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute left-5 top-5 z-20 flex items-center gap-2">
          <span className="rounded-full border border-white/15 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
            Case Study
          </span>
          {project.priority ? (
            <span className="rounded-full border border-brand/30 bg-brand/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand backdrop-blur-md">
              Featured
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/80">{releaseYear}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{project.title}</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-grow flex-col p-6">
        <div className="grid gap-4 border-b border-border/40 pb-5 sm:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/70">Focus</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              Product-minded engineering with practical automation, clean implementation, and usable interfaces.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/70">Summary</p>
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{project.description}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {displayStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium text-foreground/80"
            >
              {tech}
            </span>
          ))}
          {stack.length > displayStack.length ? (
            <span className="rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted">
              +{stack.length - displayStack.length} more
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/70">Built With</p>
            <p className="mt-1 text-sm text-muted">{project.tech_stack}</p>
          </div>
          {project.github_url && (
            <a
              className="soft-link inline-block relative z-10 rounded-xl border border-border/50 px-3 py-2"
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {project.live_url && (
            <a
              className="soft-link inline-block relative z-10 rounded-xl border border-border/50 px-3 py-2"
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </a>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-sm">
          <span className="font-semibold text-foreground/90">Explore project details</span>
          <span className="text-brand transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </div>
      </div>
    </motion.article>
  );
}
