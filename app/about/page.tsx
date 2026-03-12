import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Md. Rakibul Hasan \u2014 Computer Science and Engineering student at Begum Rokeya University, developer and AI Automation Enthusiast.",
};

const skillGroups = [
  {
    label: "Programming Languages",
    skills: ["Python", "Java", "JavaScript"],
  },
  {
    label: "Frameworks & Technologies",
    skills: ["Django", "Next.js", "REST APIs", "Database Design", "Automation"],
  },
  {
    label: "Tools & Platforms",
    skills: ["Linux", "Ubuntu", "Git", "IntelliJ IDEA", "Arduino IDE"],
  },
];

const certifications = [
  {
    title: "Certified Ethical Hacker (CEH)",
    issuer: "Arena Web Security",
    badge: "CEH",
  },
  {
    title: "Learn Ethical Hacking From Scratch 2024",
    issuer: "Udemy",
    badge: "Udemy",
  },
  {
    title: "Website Hacking / Penetration Testing",
    issuer: "Udemy",
    badge: "Udemy",
  },
  {
    title: "The Complete Python Bootcamp",
    issuer: "Udemy",
    badge: "Udemy",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-4">
      {/* Hero Info */}
      <section className="glass rounded-3xl p-8">
        <h1 className="text-3xl">About Me</h1>
        <p className="mt-1 text-sm text-[var(--brand)]">Md. Rakibul Hasan &mdash; Rakib</p>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          I am a Computer Science and Engineering student at Begum Rokeya University, Rangpur, Bangladesh.
          I actively build software tools and automation systems and share knowledge about AI agents,
          RAG systems and modern development technologies.
        </p>
        <p className="mt-3 max-w-3xl text-[var(--muted)]">
          My work focuses on building useful digital tools, automation workflows and backend systems
          that solve real-world problems.
        </p>
      </section>

      {/* Education */}
      <section className="glass rounded-3xl p-8">
        <h2 className="text-2xl">Education</h2>
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] text-lg font-bold">
            BSc
          </div>
          <div>
            <p className="font-semibold">Bachelor of Science in Computer Science and Engineering</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Begum Rokeya University, Rangpur</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Bangladesh</p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="glass rounded-3xl p-8">
        <h2 className="text-2xl">Skills</h2>
        <div className="mt-4 space-y-5">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">{group.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-[var(--line)] bg-[var(--brand-soft)] px-3 py-1.5 text-sm text-[var(--brand)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="glass rounded-3xl p-8">
        <h2 className="text-2xl">Certifications</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {certifications.map((cert) => (
            <div key={cert.title} className="flex items-start gap-3 rounded-2xl border border-[var(--line)] p-4">
              <span className="flex-shrink-0 rounded-lg bg-[var(--brand-soft)] px-2 py-1 text-xs font-bold text-[var(--brand)]">
                {cert.badge}
              </span>
              <div>
                <p className="text-sm font-medium">{cert.title}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
