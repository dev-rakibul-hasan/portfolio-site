import { Reveal } from "@/components/reveal";
import { getBlogPosts } from "@/lib/queries";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Blog | Rakib.dev",
  description: "Read my latest thoughts on technology, development, and AI.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Latest Writing</h1>
          <p className="text-xl text-muted max-w-2xl">
            Sharing my experiences, tutorials, and insights from the world of software engineering.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-12">
        {posts.map((post, index) => (
          <Reveal key={post.id} delay={index * 0.1}>
            <Link 
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
          </Reveal>
        ))}
      </div>
    </div>
  );
}
