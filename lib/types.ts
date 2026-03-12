export type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string;
  image_url: string;
  github_url: string;
  live_url: string;
  priority?: boolean;
  created_at: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  platform: string;
  description: string;
  certificate_url: string;
  image_url: string;
  issue_date: string;
  priority?: boolean;
  created_at: string;
};

export type TimelineItemType = "certificate" | "project" | "achievement";

export type TimelineItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: TimelineItemType;
  priority?: boolean;
  progress?: number;
  issuer?: string;
  platform?: string;
  certificate_url?: string;
};

export type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  published_at: string;
};

export type SiteSettings = {
  hero_title: string;
  hero_description: string;
  about_me: string;
  about_description: string;
  skills: string; // JSON string or comma-separated
  core_focus: string; // JSON string or comma-separated
  github: string;
  linkedin: string;
  email: string;
  phone: string;
  whatsapp: string;
  resume_url: string;
  profile_image_url: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};
