import { Reveal } from "@/components/reveal";
import { getTools } from "@/lib/queries";
import Link from "next/link";

export const metadata = {
  title: "Tools | Rakib.dev",
  description: "A collection of AI-powered tools and utilities.",
};

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <div className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">SaaS Tools</h1>
          <p className="text-xl text-muted max-w-2xl">
            Powerful utilities designed to streamline workflows and enhance productivity using AI.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <Reveal key={tool.id} delay={index * 0.1}>
            <Link 
              href={`/tools/${tool.slug}`}
              className="glass group relative overflow-hidden rounded-[2rem] p-8 transition-all hover:-translate-y-1 hover:shadow-glass-light dark:hover:shadow-glass block h-full"
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
          </Reveal>
        ))}
      </div>
    </div>
  );
}
