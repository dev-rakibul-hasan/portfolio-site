"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { SiteSettings } from "@/lib/types";
import {
  ExternalLink,
  Bot, Code2, Database, Cpu, Zap,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 26 },
  },
};

const STATS = [
  { value: "10+", label: "AI Automation Projects" },
  { value: "5+",  label: "AI Agents Built" },
  { value: "20+", label: "Tools Developed" },
];

// ─── HeroProfile layout constants (500 × 500 container) ───────────────────────
const C = 250;          // center of the 500px square
const IMG_R = 122;      // just outside the 244px-diameter image
const ORBIT_R = 204;    // radius at which bubble centers sit

function toRad(deg: number) { return (deg * Math.PI) / 180; }

type Skill = {
  id: string;
  label: string;
  Icon: React.ElementType;
  tooltip: string;
  angle: number;          // degrees, 0 = right (→)
  floatY: [number, number];
  floatX: [number, number];
  dur: number;
};

const SKILLS: Skill[] = [
  {
    id: "ai-agents",
    label: "AI Agents",
    Icon: Bot,
    tooltip: "Autonomous pipelines & multi-agent orchestration",
    angle: -58,
    floatY: [-7,  5], floatX: [ 3, -3], dur: 5.2,
  },
  {
    id: "python",
    label: "Python Dev",
    Icon: Code2,
    tooltip: "Clean, typed Python for backends & automation",
    angle: 18,
    floatY: [ 5, -7], floatX: [-4,  4], dur: 4.9,
  },
  {
    id: "rag",
    label: "RAG Systems",
    Icon: Database,
    tooltip: "Retrieval-Augmented Generation data pipelines",
    angle: 112,
    floatY: [-5,  7], floatX: [ 4, -4], dur: 5.5,
  },
  {
    id: "llm",
    label: "LLM Apps",
    Icon: Cpu,
    tooltip: "Production LLM integrations & fine-tuning",
    angle: 200,
    floatY: [ 6, -5], floatX: [-3,  3], dur: 4.7,
  },
  {
    id: "automation",
    label: "Automation",
    Icon: Zap,
    tooltip: "End-to-end workflow & process automation",
    angle: -130,
    floatY: [-6,  6], floatX: [ 3, -3], dur: 5.1,
  },
];

// ─── HeroProfile Component ─────────────────────────────────────────────────────
function HeroProfile({ imageUrl }: { imageUrl: string }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.84 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 170, damping: 22, delay: 0.22 }}
      className="relative mx-auto hidden items-center justify-center lg:flex"
      style={{ width: 500, height: 500 }}
    >
      {/* SVG layer: orbital rings + connector dashes + anchor dots */}
      <svg
        className="pointer-events-none absolute inset-0"
        width={500}
        height={500}
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer dashed orbital ring */}
        <circle cx={C} cy={C} r={ORBIT_R}
          fill="none"
          stroke="rgba(68,175,255,0.12)"
          strokeWidth="1"
          strokeDasharray="4 9"
        />
        {/* Inner softer orbital ring */}
        <circle cx={C} cy={C} r={ORBIT_R - 36}
          fill="none"
          stroke="rgba(68,175,255,0.07)"
          strokeWidth="1"
          strokeDasharray="3 10"
        />

        {/* Connector: from image edge → bubble edge */}
        {SKILLS.map((s) => {
          const r = toRad(s.angle);
          return (
            <line
              key={s.id + "-line"}
              x1={C + Math.cos(r) * (IMG_R + 5)}
              y1={C + Math.sin(r) * (IMG_R + 5)}
              x2={C + Math.cos(r) * (ORBIT_R - 50)}
              y2={C + Math.sin(r) * (ORBIT_R - 50)}
              stroke="rgba(68,175,255,0.20)"
              strokeWidth="1"
              strokeDasharray="3 5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Anchor dots on the image ring */}
        {SKILLS.map((s) => {
          const r = toRad(s.angle);
          return (
            <circle
              key={s.id + "-dot"}
              cx={C + Math.cos(r) * IMG_R}
              cy={C + Math.sin(r) * IMG_R}
              r={2.8}
              fill="rgba(68,175,255,0.60)"
            />
          );
        })}
      </svg>

      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute animate-pulse-slow"
        style={{
          width: 320, height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(68,175,255,0.17) 0%, transparent 68%)",
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Rotating conic arc ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: 272, height: 272,
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, transparent 10%, rgba(68,175,255,0.92) 26%, rgba(68,175,255,0.30) 42%, transparent 58%, rgba(20,184,166,0.68) 76%, transparent 92%)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black 0)",
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black 0)",
        }}
      />

      {/* Pulsing glow ring */}
      <motion.div
        animate={{ scale: [1, 1.055, 1], opacity: [0.30, 0.68, 0.30] }}
        transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 272, height: 272,
          borderRadius: "50%",
          border: "1px solid rgba(68,175,255,0.34)",
          boxShadow: "0 0 52px rgba(68,175,255,0.22), inset 0 0 32px rgba(68,175,255,0.04)",
        }}
      />

      {/* Soft static inner border */}
      <div
        style={{
          position: "absolute",
          width: 248, height: 248,
          borderRadius: "50%",
          border: "1px solid rgba(68,175,255,0.14)",
        }}
      />

      {/* Profile image */}
      <div
        className="relative z-10 overflow-hidden rounded-full"
        style={{
          width: 244, height: 244,
          border: "2px solid rgba(68,175,255,0.24)",
          boxShadow: "0 0 60px rgba(68,175,255,0.22), 0 24px 64px rgba(0,0,0,0.34)",
          background:
            "linear-gradient(135deg, rgba(68,175,255,0.16) 0%, rgba(5,15,26,0.28) 50%, rgba(20,184,166,0.14) 100%)",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Md. Rakibul Hasan"
            fill
            sizes="244px"
            unoptimized={imageUrl.startsWith("http")}
            className="object-cover transition-transform duration-500 hover:scale-[1.04]"
            priority
          />
        ) : (
          <Image
            src="/profile.png"
            alt="Md. Rakibul Hasan"
            fill
            sizes="244px"
            className="object-cover transition-transform duration-500 hover:scale-[1.04]"
            priority
          />
        )}
      </div>

      {/* Floating skill bubbles */}
      {SKILLS.map((s, i) => {
        const r = toRad(s.angle);
        const bx = C + Math.cos(r) * ORBIT_R;
        const by = C + Math.sin(r) * ORBIT_R;
        const isHovered = hoveredId === s.id;

        return (
          <div
            key={s.id}
            className="absolute z-20"
            style={{
              left: bx,
              top: by,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: [s.floatX[0], s.floatX[1], s.floatX[0]],
                y: [s.floatY[0], s.floatY[1], s.floatY[0]],
              }}
              whileHover={{ scale: 1.13 }}
              transition={{
                opacity: { duration: 0.35, delay: 0.72 + i * 0.1 },
                scale: {
                  duration: 0.45, delay: 0.72 + i * 0.1,
                  type: "spring", stiffness: 260, damping: 20,
                },
                x: { duration: s.dur, repeat: Infinity, ease: "easeInOut" },
                y: { duration: s.dur * 0.87, repeat: Infinity, ease: "easeInOut" },
              }}
              onHoverStart={() => setHoveredId(s.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="relative cursor-default"
            >
              {/* Pill bubble */}
              <div
                className="flex items-center gap-2 rounded-full px-4 py-[9px] text-[11.5px] font-semibold backdrop-blur-2xl select-none"
                style={{
                  border: isHovered
                    ? "1px solid rgba(68,175,255,0.62)"
                    : "1px solid rgba(68,175,255,0.22)",
                  background: isHovered
                    ? "rgba(68,175,255,0.14)"
                    : "rgba(8,18,32,0.68)",
                  color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(232,241,251,0.88)",
                  boxShadow: isHovered
                    ? "0 0 30px rgba(68,175,255,0.48), 0 8px 24px rgba(0,0,0,0.22)"
                    : "0 8px 28px rgba(0,0,0,0.20)",
                  transition: "border 0.2s, background 0.2s, box-shadow 0.2s, color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                <s.Icon
                  style={{
                    width: 13, height: 13, flexShrink: 0,
                    color: isHovered ? "rgba(68,175,255,1)" : "rgba(68,175,255,0.80)",
                    filter: isHovered ? "drop-shadow(0 0 6px rgba(68,175,255,0.9))" : "none",
                    transition: "color 0.2s, filter 0.2s",
                  }}
                />
                {s.label}
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.93 }}
                    transition={{ duration: 0.16 }}
                    className="pointer-events-none absolute z-30 rounded-xl px-3 py-2 text-[11px] font-medium backdrop-blur-xl"
                    style={{
                      bottom: "calc(100% + 10px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(8,18,32,0.88)",
                      border: "1px solid rgba(68,175,255,0.30)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.38)",
                      color: "rgba(232,241,251,0.82)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.tooltip}
                    <span
                      className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 h-0 w-0"
                      style={{
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: "5px solid rgba(68,175,255,0.30)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

export function HeroSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-border/50 bg-background/40 p-6 backdrop-blur-xl shadow-glass-light dark:shadow-glass sm:mt-10 sm:rounded-[2.5rem] sm:p-10 lg:p-14">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/20 blur-[100px] animate-pulse-slow" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_50%,rgba(68,175,255,0.065)_0,transparent_62%)]" />

      <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
        {/* ── LEFT: Text Content ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start"
        >
          {/* Hero headline */}
          <motion.h1
            variants={slideUp}
            className="mt-6 max-w-[34rem] text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.1rem]"
          >
            Build{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(92deg, #44afff 0%, #38d9a9 55%, #44afff 100%)",
              }}
            >
              Intelligent AI Agents,
            </span>{" "}
            Automation Systems and{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(92deg, #38d9a9 0%, #44afff 100%)",
              }}
            >
              Scalable Web Apps
            </span>
          </motion.h1>

          {/* 3. Intro paragraph */}
          <motion.p
            variants={slideUp}
            className="mt-5 max-w-[30rem] text-base leading-relaxed text-muted sm:text-[1.05rem]"
          >
            Hi, I&apos;m Rakibul Hasan. I build AI-powered automation systems, RAG
            pipelines and modern web applications designed for real-world use.
          </motion.p>

          {/* 4. CTA buttons */}
          <motion.div variants={slideUp} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#projects"
              className="inline-flex items-center rounded-xl bg-brand px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(68,175,255,0.38)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(68,175,255,0.56)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              View Projects
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center rounded-xl border border-border/60 bg-background/50 px-7 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/45 hover:bg-brand/10 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Contact Me
            </Link>
            {settings.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-7 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/45 hover:bg-brand/10 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            )}
          </motion.div>

          {/* 5. Stats */}
          <motion.div
            variants={slideUp}
            className="mt-10 flex flex-wrap gap-6 sm:gap-8"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={slideUp}
                custom={i}
                className="flex flex-col"
              >
                <span
                  className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #44afff 0%, #38d9a9 100%)",
                  }}
                >
                  {s.value}
                </span>
                <span className="mt-0.5 text-xs font-semibold text-muted">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile-only simple profile image (no bubbles) */}
          <motion.div
            variants={slideUp}
            className="mt-10 flex justify-center lg:hidden w-full"
          >
            <div
              className="relative overflow-hidden rounded-full"
              style={{
                width: 200, height: 200,
                border: "2px solid rgba(68,175,255,0.26)",
                boxShadow: "0 0 48px rgba(68,175,255,0.20), 0 16px 48px rgba(0,0,0,0.30)",
                background:
                  "linear-gradient(135deg, rgba(68,175,255,0.16) 0%, rgba(5,15,26,0.28) 50%, rgba(20,184,166,0.14) 100%)",
              }}
            >
              {settings.profile_image_url ? (
                <Image
                  src={settings.profile_image_url}
                  alt="Md. Rakibul Hasan"
                  fill
                  sizes="200px"
                  unoptimized={settings.profile_image_url.startsWith("http")}
                  className="object-cover"
                  priority
                />
              ) : (
                <Image
                  src="/profile.png"
                  alt="Md. Rakibul Hasan"
                  fill
                  sizes="200px"
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: HeroProfile (lg only — includes orbital bubbles) ── */}
        <HeroProfile imageUrl={settings.profile_image_url} />
      </div>
    </section>
  );
}

