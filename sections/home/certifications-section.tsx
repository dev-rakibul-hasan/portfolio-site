import { CertificateCard } from "@/components/certificate-card";
import { Reveal } from "@/components/reveal";
import type { Certificate } from "@/lib/types";

export function CertificationsSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section id="certifications" className="scroll-mt-32 rounded-[2.5rem] border border-border/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-6 sm:p-8 lg:p-10">
      <Reveal>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/80">Credentials</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">Certifications</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-right">
            Verified certificates and learning milestones that strengthen the technical depth behind the shipped work.
          </p>
        </div>
        {certificates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-[2rem] p-8 text-center text-muted">
            No certifications added yet. Add your first certificate from the admin dashboard.
          </div>
        )}
      </Reveal>
    </section>
  );
}
