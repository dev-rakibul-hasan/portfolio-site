import { Reveal } from "@/components/reveal";
import { getProjects } from "@/lib/queries";
import { ProjectCard } from "@/components/project-card";

export const metadata = {
  title: "Projects | Rakib.dev",
  description: "Explore my latest projects and software developments.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Projects</h1>
          <p className="text-xl text-muted max-w-2xl">
            A showcase of my recent work in AI automation, SaaS development, and creative coding.
          </p>
        </div>
      </Reveal>

      <section className="grid gap-8 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.1}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </section>
    </div>
  );
}
