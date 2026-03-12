import { mockBlogPosts, mockCertificates, mockProjects, mockSiteSettings, mockTools } from "@/lib/mock-data";
import type {
  BlogPost,
  Certificate,
  Project,
  SiteSettings,
  TimelineItem,
  Tool,
} from "@/lib/types";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getServerSupabase } from "@/lib/supabase/server";

export async function getProjects(): Promise<Project[]> {
  const supabase = getServerSupabase();
  if (!supabase) return mockProjects;

  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error || !data) return mockProjects;
  return data as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.id === id) ?? null;
}

export async function getTools(): Promise<Tool[]> {
  const supabase = getServerSupabase();
  if (!supabase) return mockTools;

  const { data, error } = await supabase.from("tools").select("*").order("created_at", { ascending: false });
  if (error || !data) return mockTools;
  return data as Tool[];
}

export async function getCertificates(): Promise<Certificate[]> {
  const supabase = getServerSupabase();
  const adminSupabase = getAdminSupabase();

  if (!supabase) {
    if (!adminSupabase) return mockCertificates;

    const { data, error } = await adminSupabase
      .from("certificates")
      .select("*")
      .order("issue_date", { ascending: false });

    if (error || !data) return mockCertificates;
    return data as Certificate[];
  }

  const { data, error } = await supabase.from("certificates").select("*").order("issue_date", { ascending: false });

  if (error) {
    if (!adminSupabase) return mockCertificates;

    const { data: adminData, error: adminError } = await adminSupabase
      .from("certificates")
      .select("*")
      .order("issue_date", { ascending: false });

    if (adminError || !adminData) return mockCertificates;
    return adminData as Certificate[];
  }

  if (!data) {
    return mockCertificates;
  }

  if (data.length === 0 && adminSupabase) {
    const { data: adminData, error: adminError } = await adminSupabase
      .from("certificates")
      .select("*")
      .order("issue_date", { ascending: false });

    if (!adminError && adminData && adminData.length > 0) {
      return adminData as Certificate[];
    }
  }

  return data as Certificate[];
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const tools = await getTools();
  return tools.find((tool) => tool.slug === slug) ?? null;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = getServerSupabase();
  if (!supabase) return mockBlogPosts;

  const { data, error } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
  if (error || !data) return mockBlogPosts;
  return data as BlogPost[];
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getServerSupabase();
  if (!supabase) return mockSiteSettings;

  const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
  if (error || !data) return mockSiteSettings;
  return data as SiteSettings;
}

export async function getTimelineItems(): Promise<TimelineItem[]> {
  const [projects, certificates] = await Promise.all([getProjects(), getCertificates()]);

  const projectItems: TimelineItem[] = projects.map((project) => ({
    id: `project-${project.id}`,
    title: project.title,
    description: project.description,
    date: project.created_at,
    type: "project",
    priority: Boolean(project.priority),
  }));

  const certificateItems: TimelineItem[] = certificates.map((certificate) => ({
    id: `certificate-${certificate.id}`,
    title: certificate.title,
    description: certificate.description,
    date: certificate.issue_date,
    type: "certificate",
    priority: true,
    issuer: certificate.issuer,
    platform: certificate.platform,
    certificate_url: certificate.certificate_url,
  }));

  return [...projectItems, ...certificateItems].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export async function getDashboardStats() {
  const supabase = getServerSupabase();
  if (!supabase) return { projects: 4, tools: 3, certificates: 2, blogPosts: 3, messages: 0 };

  const [projects, tools, certificates, posts, messages] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("tools").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
  ]);

  return {
    projects: projects.count || 0,
    tools: tools.count || 0,
    certificates: certificates.count || 0,
    blogPosts: posts.count || 0,
    messages: messages.count || 0,
  };
}
