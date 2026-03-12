import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, getProjects } from "@/lib/queries";
import { Reveal } from "@/components/reveal";

type ProjectPageProps = {
  params: { id: string };
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectById(params.id);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Reveal>
        <Link 
          href="/#projects" 
          className="inline-flex items-center text-sm font-medium text-brand hover:underline mb-8"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl glass border border-border/50">
          <Image 
            src={project.image_url} 
            alt={project.title} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">{project.title}</h1>
            <p className="text-lg text-white/80 max-w-2xl">{project.tech_stack}</p>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Reveal delay={0.2}>
            <section className="glass rounded-[2rem] p-8 md:p-10 mb-8 border border-border/50">
              <h2 className="text-2xl font-bold mb-6">About the Project</h2>
              <div className="prose prose-invert max-w-none text-muted leading-relaxed">
                {project.description}
              </div>
            </section>
          </Reveal>
        </div>

        <div className="lg:col-span-1">
          <Reveal delay={0.3}>
            <section className="glass rounded-[2rem] p-8 border border-border/50 sticky top-32">
              <h2 className="text-xl font-bold mb-6">Details</h2>
              
              <div className="space-y-6">
                {project.live_url && (
                  <Link 
                    href={project.live_url} 
                    target="_blank" 
                    className="flex items-center justify-center w-full rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand/90 hover:scale-[1.02] shadow-glow"
                  >
                    View Live Site
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                )}
                
                {project.github_url && (
                  <Link 
                    href={project.github_url} 
                    target="_blank" 
                    className="flex items-center justify-center w-full rounded-full bg-brand/10 border border-brand/20 px-6 py-3 text-sm font-bold text-brand transition-all hover:bg-brand/20 hover:scale-[1.02]"
                  >
                    Source Code
                    <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </Link>
                )}
                
                <div className="pt-6 border-t border-border/50">
                  <p className="text-xs uppercase tracking-widest font-bold text-muted mb-4">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.split(",").map((tech) => (
                      <span 
                        key={tech} 
                        className="px-3 py-1 bg-brand/5 border border-brand/10 rounded-full text-xs font-semibold text-brand/80"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
