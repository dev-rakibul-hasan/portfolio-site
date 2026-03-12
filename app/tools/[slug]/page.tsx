import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug, getTools } from "@/lib/queries";
import { Reveal } from "@/components/reveal";

type ToolPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  return {
    title: tool.name,
    description: tool.description,
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const tool = await getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Reveal>
        <Link 
          href="/#tools" 
          className="inline-flex items-center text-sm font-medium text-brand hover:underline mb-8"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tools
        </Link>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="glass rounded-[2rem] p-10 md:p-16 border border-border/50 mb-12 relative overflow-hidden text-center">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-[80px]" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-brand/5 blur-[80px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex rounded-2xl bg-background/50 p-5 shadow-glow backdrop-blur-md border border-border/50 text-brand text-4xl mb-8">
               {tool.icon}
            </span>
            <p className="text-brand/80 font-mono text-sm tracking-widest uppercase mb-4">/{tool.slug}</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">{tool.name}</h1>
            <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Reveal delay={0.2}>
          <div className="glass rounded-[2rem] p-8 md:p-10 border border-border/50 h-full">
            <h2 className="text-2xl font-bold mb-6">Overview</h2>
            <p className="text-muted leading-relaxed">
              This tool was designed to solve specific challenges in development and productivity. 
              By utilizing modern AI techniques and streamlined UI/UX patterns, it provides an
              efficient way to handle complex tasks with minimal effort.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="glass rounded-[2rem] p-8 md:p-10 border border-border/50 h-full">
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <ul className="space-y-4">
              {["Blazing fast performance", "Intuitive user interface", "AI-powered suggestions", "Seamless integration"].map((feature) => (
                <li key={feature} className="flex items-center text-muted">
                  <svg className="h-5 w-5 text-brand mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      
      <Reveal delay={0.4}>
        <div className="mt-12 text-center">
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center rounded-full bg-brand px-10 py-4 text-lg font-bold text-white transition-all hover:bg-brand/90 hover:scale-[1.05] shadow-glow"
          >
            Get Started with {tool.name}
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
