"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

import { Menu, X } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Certifications", href: "/certifications" },
  { name: "SaaS Tools", href: "/tools" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function SiteHeader({ profileImageUrl }: { profileImageUrl?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-full z-50 px-4 max-w-5xl">
      <div className="glass flex items-center justify-between rounded-full px-5 py-3 shadow-glass relative z-50">
        {/* Brand */}
        <Link 
          href="/" 
          onClick={() => {
            setIsOpen(false);
          }}
          className="relative group flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground transition-colors hover:text-brand"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border/50 bg-background/50 shadow-sm flex-shrink-0">
             {profileImageUrl ? (
                <Image 
                  src={profileImageUrl} 
                  alt="Rakib Profile" 
                  fill 
                  className="object-cover" 
                  unoptimized={profileImageUrl.startsWith("http")}
                />
             ) : (
               <Image
                 src="/profile.png"
                 alt="Rakib"
                 fill
                 className="object-cover"
               />
             )}
          </div>
          <span className="truncate">Rakib</span>
          <span className="absolute -bottom-1 left-10.5 w-0 h-[2px] bg-brand transition-all duration-300 group-hover:w-[calc(100%-2.6rem)]"></span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full border border-border/50 bg-background/50">
          {links.map((link) => {
            const isHomeExact = link.href === "/" && pathname === "/";
            const isSubPage = link.href !== "/" && pathname.startsWith(link.href);
            const isActive = isHomeExact || isSubPage;
            
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-muted hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-brand rounded-full -z-10 shadow-glow"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/50 text-foreground transition-all hover:bg-brand/10 hover:text-brand"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-20 glass rounded-[2.5rem] p-6 shadow-2xl md:hidden flex flex-col gap-2"
          >
            {links.map((link, i) => {
              const isHomeExact = link.href === "/" && pathname === "/";
              const isSubPage = link.href !== "/" && pathname.startsWith(link.href);
              const isActive = isHomeExact || isSubPage;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center px-6 py-4 rounded-2xl text-lg font-semibold transition-all",
                      isActive 
                        ? "bg-brand/10 text-brand border border-brand/20 shadow-glow-sm" 
                        : "text-muted hover:bg-white/5 hover:text-foreground border border-transparent"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
