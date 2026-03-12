import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { getBlogPosts, getCertificates, getProjects, getSiteSettings, getTimelineItems, getTools } from "@/lib/queries";
import { AboutPreview } from "@/sections/home/about-preview";
import { CertificationsSection } from "@/sections/home/certifications-section";
import { HeroSection } from "@/sections/home/hero-section";
import { StatsOverview } from "@/sections/home/stats-overview";
import { ProjectCard } from "@/components/project-card";
import { ContactForm } from "@/components/contact-form";
import { InteractiveRoadmapTimeline } from "@/components/interactive-roadmap-timeline";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, tools, posts, settings, timelineItems, certificates] = await Promise.all([
    getProjects(),
    getTools(),
    getBlogPosts(),
    getSiteSettings(),
    getTimelineItems(),
    getCertificates(),
  ]);

  return (
    <div className="flex flex-col gap-16 md:gap-24 lg:gap-32">
      
      {/* Hero Section */}
      <Reveal>
        <HeroSection settings={settings} />
      </Reveal>

      <Reveal>
        <InteractiveRoadmapTimeline items={timelineItems} />
      </Reveal>

      <AboutPreview settings={settings} />

      <StatsOverview projectCount={projects.length} toolCount={tools.length} postCount={posts.length} />

      <CertificationsSection certificates={certificates} />

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-32">
        <Reveal>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/80">Selected Work</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight">Featured Projects</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-right">
              A curated set of builds focused on automation, product execution, and solving specific operational problems.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Tools Section */}
      <section id="tools" className="scroll-mt-32">
        <Reveal>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/80">Utilities</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight">SaaS Tools</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-right">
              Compact tools designed to remove friction, automate repetitive work, and ship useful functionality quickly.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link 
                href={`/tools/${tool.slug}`}
                key={tool.id} 
                className="glass group relative overflow-hidden rounded-[2rem] p-8 transition-all hover:-translate-y-1 hover:shadow-glass-light dark:hover:shadow-glass block"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/10 blur-[40px] transition-all duration-500 group-hover:scale-150 group-hover:bg-brand/20" />
                <div className="relative z-10">
                  <span className="inline-flex rounded-xl bg-background/50 p-2.5 shadow-sm backdrop-blur-md border border-border/50 text-brand mb-4">
                     <span className="text-xs uppercase tracking-widest font-bold">{tool.icon}</span>
                  </span>
                  <p className="text-sm font-medium text-brand/80 pb-1">/{tool.slug}</p>
                  <h3 className="text-2xl font-semibold tracking-tight">{tool.name}</h3>
                  <p className="mt-3 text-base text-muted leading-relaxed">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Blog Section */}
      <section id="blog" className="scroll-mt-32">
        <Reveal>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/80">Writing</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight">Latest Writing</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-right">
              Notes on AI systems, development workflows, and practical lessons from building and shipping software.
            </p>
          </div>
          <div className="grid gap-8">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="glass group relative overflow-hidden rounded-[2rem] flex flex-col md:flex-row transition-all hover:-translate-y-1 hover:shadow-glass-light dark:hover:shadow-glass"
              >
                 <div className="relative h-64 md:h-auto md:w-1/3 shrink-0 overflow-hidden">
                   <div className="absolute inset-0 bg-brand/10 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay" />
                   <Image 
                     src={post.cover_image} 
                     alt={post.title} 
                     fill 
                     className="object-cover transition-transform duration-700 group-hover:scale-105" 
                     sizes="(max-width: 768px) 100vw, 33vw" 
                   />
                 </div>
                 <div className="p-8 md:p-10 flex flex-col justify-center">
                   <p className="text-sm font-medium text-brand">{new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                   <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight group-hover:text-brand transition-colors">{post.title}</h3>
                   <p className="mt-4 line-clamp-3 text-lg text-muted leading-relaxed">{post.content}</p>
                   <div className="mt-6 flex items-center text-sm font-semibold text-brand">
                     Read Article
                     <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                     </svg>
                   </div>
                 </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-32 mb-20">
        <Reveal>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/80">Contact</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight">Get In Touch</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-right">
              If you need a collaborator for automation, product engineering, or AI-enabled workflows, start the conversation here.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="glass rounded-[2rem] p-8 sm:p-10 flex flex-col justify-center">
              <h3 className="text-2xl font-bold tracking-tight mb-4">Let&apos;s build something together.</h3>
              <p className="text-muted leading-relaxed mb-8">
                I&apos;m currently available for freelance work and new opportunities. Whether you have a project in mind or just want to chat, feel free to reach out.
              </p>
              <div className="space-y-4">
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-muted hover:text-brand transition-colors">
                  <div className="p-3 rounded-full bg-brand/10 text-brand">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  {settings.email}
                </a>
                {settings.phone && (
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 text-muted hover:text-brand transition-colors">
                    <div className="p-3 rounded-full bg-brand/10 text-brand">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    {settings.phone}
                  </a>
                )}
                {settings.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted hover:text-brand transition-colors">
                    <div className="p-3 rounded-full bg-brand/10 text-brand">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    WhatsApp
                  </a>
                )}
                <a href={settings.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted hover:text-brand transition-colors">
                  <div className="p-3 rounded-full bg-brand/10 text-brand">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  </div>
                  GitHub Profile
                </a>
                <a href={settings.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted hover:text-brand transition-colors">
                  <div className="p-3 rounded-full bg-brand/10 text-brand">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                  </div>
                  LinkedIn Profile
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </Reveal>
      </section>

    </div>
  );
}
