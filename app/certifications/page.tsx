import { CertificateCard } from "@/components/certificate-card";
import { Reveal } from "@/components/reveal";
import { getCertificates } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Certifications | Rakib.dev",
  description: "Professional certificates, verification links, and continuing education milestones.",
};

export default async function CertificationsPage() {
  const certificates = await getCertificates();

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tighter md:text-6xl">Certifications</h1>
          <p className="max-w-2xl text-xl text-muted">
            Verified learning milestones across AI, software engineering, and modern web development.
          </p>
        </div>
      </Reveal>

      {certificates.length > 0 ? (
        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate, index) => (
            <Reveal key={certificate.id} delay={index * 0.08}>
              <CertificateCard certificate={certificate} />
            </Reveal>
          ))}
        </section>
      ) : (
        <Reveal>
          <section className="glass rounded-[2rem] p-10 text-center text-muted">
            No certifications found yet. Add certificates from the admin dashboard to show them here.
          </section>
        </Reveal>
      )}
    </div>
  );
}
