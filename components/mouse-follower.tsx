"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  angle: number;
}

const COLORS = [
  "#4285F4", // Google Blue
  "#EA4335", // Google Red
  "#FBBC05", // Google Yellow
  "#34A853", // Google Green
  "#A142F4", // Purple
  "#F442EE", // Magenta
];

export function MouseFollower() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      const count = 40;
      particles.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: 0,
        vy: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        angle: Math.random() * Math.PI * 2,
      }));
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        if (mouse.current.active) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 500) {
            const force = (1 - dist / 500) * 0.05;
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        // Friction/Damping
        p.vx *= 0.92;
        p.vy *= 0.92;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen or bounce? Let's settle around mouse.
        // If too far from mouse when active, pull harder
        if (mouse.current.active) {
            const dx = mouse.current.x - p.x;
            const dy = mouse.current.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 300) {
               p.vx += dx * 0.001;
               p.vy += dy * 0.001;
            }
        }

        // Draw particle as a dash
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        
        const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const stretch = Math.max(p.size, vel * 1.5);
        const angle = Math.atan2(p.vy, p.vx);

        ctx.moveTo(p.x, p.y);
        ctx.lineTo(
          p.x - Math.cos(angle) * stretch,
          p.y - Math.sin(angle) * stretch
        );
        ctx.stroke();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };

    const handleMouseDown = () => {
        // Burst effect on click
        particles.current.forEach(p => {
            const dx = p.x - mouse.current.x;
            const dy = p.y - mouse.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const force = 1000 / (dist + 100);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
        });
    };

    const handleMouseLeave = () => (mouse.current.active = false);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseleave", handleMouseLeave);

    resize();
    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
