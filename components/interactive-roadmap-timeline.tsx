"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { TimelineItem } from "@/lib/types";

type MarkerPoint = {
  x: number;
  y: number;
};

type TooltipState = {
  item: TimelineItem;
  point: MarkerPoint;
};

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 420;
const ROAD_PATH =
  "M 40 320 C 150 130, 290 120, 430 270 C 560 400, 730 360, 860 220 C 980 95, 1090 130, 1160 210";

const DEFAULT_ITEMS: TimelineItem[] = [
  {
    id: "i-1",
    title: "Google Cybersecurity Certificate",
    description: "Completed practical labs in threat analysis and defensive security workflows.",
    date: "2024-01-16",
    type: "certificate",
    progress: 0.1,
  },
  {
    id: "i-2",
    title: "Portfolio Platform v2",
    description: "Built a high-performance portfolio with dynamic CMS integrations and SEO routing.",
    date: "2024-05-12",
    type: "project",
    progress: 0.26,
  },
  {
    id: "i-3",
    title: "Hackathon Finalist",
    description: "Placed in the top finalists with an AI-based automation assistant prototype.",
    date: "2024-09-04",
    type: "achievement",
    progress: 0.42,
  },
  {
    id: "i-4",
    title: "Serverless Builder Toolkit",
    description: "Released a deployment toolkit for serverless workflows with reusable templates.",
    date: "2025-01-23",
    type: "project",
    priority: true,
    progress: 0.58,
  },
  {
    id: "i-5",
    title: "Meta Front-End Certificate",
    description: "Strengthened React architecture, accessibility, and UI performance optimization.",
    date: "2025-03-19",
    type: "certificate",
    progress: 0.75,
  },
  {
    id: "i-6",
    title: "Realtime Collaboration Suite",
    description: "Launched multi-user collaboration features with robust synchronization handling.",
    date: "2025-08-10",
    type: "project",
    progress: 0.9,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function markerKind(item: TimelineItem) {
  if (item.type === "certificate") {
    return "flag";
  }

  if (item.type === "project" && item.priority) {
    return "flag";
  }

  return "dot";
}

export function InteractiveRoadmapTimeline({ items = DEFAULT_ITEMS }: { items?: TimelineItem[] }) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [items],
  );
  const reduceMotion = useReducedMotion();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const insideRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0, hasValue: false });
  const strengthsRef = useRef<number[]>([]);

  const [points, setPoints] = useState<MarkerPoint[]>([]);
  const [strengths, setStrengths] = useState<number[]>(() => sortedItems.map(() => 0));
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [enableInteraction, setEnableInteraction] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setEnableInteraction(false);
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const update = () => setEnableInteraction(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [reduceMotion]);

  useEffect(() => {
    strengthsRef.current = sortedItems.map(() => 0);
    setStrengths(sortedItems.map(() => 0));
    setTooltip(null);
  }, [sortedItems]);

  useEffect(() => {
    const updatePoints = () => {
      const pathEl = pathRef.current;
      if (!pathEl) {
        return;
      }

      const totalLength = pathEl.getTotalLength();
      const nextPoints = sortedItems.map((item, index) => {
        const fallback =
          sortedItems.length > 1
            ? 0.08 + (index / (sortedItems.length - 1)) * 0.84
            : 0.5;
        const t = clamp(item.progress ?? fallback, 0.04, 0.96);
        const p = pathEl.getPointAtLength(totalLength * t);
        return { x: p.x, y: p.y };
      });

      setPoints(nextPoints);
    };

    updatePoints();
    window.addEventListener("resize", updatePoints);

    return () => {
      window.removeEventListener("resize", updatePoints);
    };
  }, [sortedItems]);

  useEffect(() => {
    if (!enableInteraction) {
      strengthsRef.current = sortedItems.map(() => 0);
      setStrengths(sortedItems.map(() => 0));
      setTooltip(null);
      return;
    }

    const animate = () => {
      const nextStrengths = [...strengthsRef.current];
      let shouldContinue = false;

      if (!nextStrengths.length || !points.length || points.length !== sortedItems.length) {
        frameRef.current = null;
        return;
      }

      let activeIndex = -1;
      let activeValue = 0;

      for (let i = 0; i < points.length; i += 1) {
        const point = points[i];
        const dx = mouseRef.current.x - point.x;
        const dy = mouseRef.current.y - point.y;
        const distance = Math.hypot(dx, dy);

        const influenceRadius = 170;
        const target = insideRef.current
          ? Math.pow(clamp(1 - distance / influenceRadius, 0, 1), 1.65)
          : 0;

        const next = nextStrengths[i] + (target - nextStrengths[i]) * 0.2;
        nextStrengths[i] = Math.abs(next) < 0.001 ? 0 : next;

        if (Math.abs(target - nextStrengths[i]) > 0.001 || nextStrengths[i] > 0.002) {
          shouldContinue = true;
        }

        if (nextStrengths[i] > activeValue) {
          activeValue = nextStrengths[i];
          activeIndex = i;
        }
      }

      strengthsRef.current = nextStrengths;
      setStrengths(nextStrengths);

      if (activeIndex >= 0 && activeValue > 0.22) {
        setTooltip({ item: sortedItems[activeIndex], point: points[activeIndex] });
      } else {
        setTooltip(null);
      }

      if (shouldContinue) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        frameRef.current = null;
      }
    };

    const startFrame = () => {
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    const onMove = (event: MouseEvent) => {
      const svgEl = svgRef.current;
      if (!svgEl) {
        return;
      }

      const rect = svgEl.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT;

      mouseRef.current = {
        x: clamp(x, 0, VIEWBOX_WIDTH),
        y: clamp(y, 0, VIEWBOX_HEIGHT),
        hasValue: true,
      };

      insideRef.current = true;
      startFrame();
    };

    const onLeave = () => {
      insideRef.current = false;
      startFrame();
    };

    const node = wrapperRef.current;
    if (!node) {
      return;
    }

    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseenter", onMove);
    node.addEventListener("mouseleave", onLeave);

    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseenter", onMove);
      node.removeEventListener("mouseleave", onLeave);

      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [enableInteraction, points, sortedItems]);

  return (
    <section className="relative scroll-mt-28" id="roadmap">
      <div className="glass relative overflow-hidden rounded-[2rem] border border-border/60 p-5 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(68,175,255,0.18),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(33,200,195,0.16),transparent_45%)]" />

        <div className="relative z-10 mb-6 sm:mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand/80">Timeline</p>
        </div>

        <div
          ref={wrapperRef}
          className="relative z-10 h-[290px] w-full sm:h-[340px] lg:h-[370px]"
          style={{ perspective: "1000px" }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            className="h-full w-full"
            role="img"
            aria-label="Interactive roadmap timeline"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="roadStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(28,45,67,0.95)" />
                <stop offset="100%" stopColor="rgba(16,38,62,0.95)" />
              </linearGradient>
              <linearGradient id="roadGlow" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(72,181,255,0.3)" />
                <stop offset="100%" stopColor="rgba(46,245,220,0.3)" />
              </linearGradient>
              <linearGradient id="connectGlow" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(68,175,255,0.26)" />
                <stop offset="100%" stopColor="rgba(35,230,210,0.3)" />
              </linearGradient>
            </defs>

            <path
              ref={pathRef}
              d={ROAD_PATH}
              fill="none"
              stroke="url(#roadStroke)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="40"
            />
            <path d={ROAD_PATH} fill="none" stroke="url(#roadGlow)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="50" opacity="0.3" />
            <path
              d={ROAD_PATH}
              fill="none"
              stroke="rgba(187, 216, 236, 0.48)"
              strokeDasharray="12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />

            {points.map((point, index) => {
              if (index === points.length - 1) {
                return null;
              }

              const next = points[index + 1];
              const glow = 0.2 + ((strengths[index] ?? 0) + (strengths[index + 1] ?? 0)) * 0.45;
              return (
                <line
                  key={`link-${sortedItems[index]?.id ?? index}`}
                  x1={point.x}
                  y1={point.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="url(#connectGlow)"
                  strokeWidth={3 + glow * 2}
                  opacity={glow}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {points.map((point, index) => {
            const item = sortedItems[index];
            if (!item) {
              return null;
            }

            const isFlag = markerKind(item) === "flag";
            const strength = strengths[index] ?? 0;

            const dx = mouseRef.current.hasValue ? mouseRef.current.x - point.x : 0;
            const dy = mouseRef.current.hasValue ? mouseRef.current.y - point.y : 0;
            const rotateY = clamp((dx / 70) * strength, -12, 12);
            const rotateX = clamp((-dy / 70) * strength, -10, 10);

            return (
              <motion.div
                key={item.id}
                className="pointer-events-none absolute"
                style={{
                  left: `${(point.x / VIEWBOX_WIDTH) * 100}%`,
                  top: `${(point.y / VIEWBOX_HEIGHT) * 100}%`,
                }}
                animate={{
                  scale: 1 + strength * 0.5,
                  rotateX,
                  rotateY,
                  z: 40 * strength,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.5 }}
              >
                {isFlag ? (
                  <div className="relative -translate-x-1/2 -translate-y-[85%]" style={{ transformStyle: "preserve-3d" }}>
                    <span className="absolute left-[6px] top-5 h-8 w-[2px] rounded-full bg-slate-200/80" />
                    <span
                      className="absolute left-0 top-0 h-5 w-6 rounded-r-sm bg-gradient-to-r from-brand to-cyan-300 shadow-[0_0_10px_rgba(68,175,255,0.6)]"
                      style={{
                        clipPath: "polygon(0 0, 100% 15%, 82% 50%, 100% 85%, 0 100%)",
                        boxShadow: `0 0 ${8 + strength * 18}px rgba(68,175,255,0.65)`,
                      }}
                    />
                    <span className="absolute left-[1px] top-0 h-2 w-2 rounded-full bg-white/90" />
                  </div>
                ) : (
                  <div
                    className="relative h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/70 bg-brand/70"
                    style={{
                      boxShadow: `0 0 ${8 + strength * 20}px rgba(68,175,255,0.75), inset 0 0 10px rgba(255,255,255,0.28)`,
                    }}
                  >
                    <span className="absolute inset-[3px] rounded-full bg-white/80" />
                  </div>
                )}
              </motion.div>
            );
          })}

          <AnimatePresence>
            {tooltip ? (
              <motion.div
                key={tooltip.item.id}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-none absolute z-20 w-[min(320px,calc(100%-1rem))] rounded-2xl border border-border/70 bg-slate-950/90 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md"
                style={{
                  left: `${(tooltip.point.x / VIEWBOX_WIDTH) * 100}%`,
                  top: `${(tooltip.point.y / VIEWBOX_HEIGHT) * 100}%`,
                  transform: "translate(-50%, -120%)",
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full border border-brand/40 bg-brand/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand">
                    {tooltip.item.type}
                  </span>
                  {tooltip.item.priority ? (
                    <span className="rounded-full border border-cyan-200/30 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-200">
                      priority
                    </span>
                  ) : null}
                </div>
                <h3 className="text-sm font-semibold text-white sm:text-base">{tooltip.item.title}</h3>
                {tooltip.item.issuer ? (
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-cyan-200/90">
                    {tooltip.item.issuer}
                    {tooltip.item.platform ? ` • ${tooltip.item.platform}` : ""}
                  </p>
                ) : null}
                <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-sm">{tooltip.item.description}</p>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  {new Date(tooltip.item.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
