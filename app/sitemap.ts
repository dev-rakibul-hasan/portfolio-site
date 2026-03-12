import type { MetadataRoute } from "next";
import { getBlogPosts, getTools } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rakibulhasan.dev";
  const [tools, posts] = await Promise.all([getTools(), getBlogPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = ["", "/about", "/projects", "/tools", "/blog", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "" ? 1 : 0.7,
    }),
  );

  const toolRoutes = tools.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: new Date(tool.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
