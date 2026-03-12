import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogPosts } from "@/lib/queries";

type BlogPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 140),
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="glass rounded-3xl p-8">
      <p className="text-sm text-[var(--muted)]">{new Date(post.published_at).toLocaleDateString()}</p>
      <h1 className="mt-2 text-3xl">{post.title}</h1>
      <p className="mt-6 whitespace-pre-line text-[var(--muted)]">{post.content}</p>
    </article>
  );
}
