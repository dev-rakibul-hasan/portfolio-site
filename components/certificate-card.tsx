"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Certificate } from "@/lib/types";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="glass group relative overflow-hidden rounded-[2rem] p-5 sm:p-6"
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/10 blur-[44px] transition-transform duration-500 group-hover:scale-125" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-[1.25rem] border border-border/50 bg-background/40">
          {certificate.image_url ? (
            <Image
              src={certificate.image_url}
              alt={certificate.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={certificate.image_url.startsWith("http")}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(68,175,255,0.16),transparent_58%)] text-sm text-muted">
              Certificate Preview
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/80">{certificate.platform}</p>
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Verified
            </span>
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{certificate.title}</h3>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted">
            <p>Issued by {certificate.issuer}</p>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted/90">
              {new Date(certificate.issue_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{certificate.description}</p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="rounded-xl border border-border/50 bg-background/45 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/75">
              Credential
            </div>
            {certificate.certificate_url ? (
              <a
                href={certificate.certificate_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand/60 hover:bg-brand/15"
              >
                View Certificate
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
