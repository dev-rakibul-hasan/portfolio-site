import type { BlogPost, Certificate, Project, SiteSettings, Tool } from "@/lib/types";

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Gas Leakage Detector with SMS Alert System",
    description:
      "A hardware-based safety system that detects gas leakage using MQ-135 gas sensor and Arduino Nano. Displays gas levels on an LCD and sends alert notifications via GSM module when leakage is detected.",
    tech_stack: "Arduino, MQ-135 Sensor, GSM Module, LCD Display, C++",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    github_url: "https://github.com/rakibul-h/gas-leakage-detector",
    live_url: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Desktop App Usage Tracker",
    description:
      "A JavaFX desktop application that tracks active applications in real time. Monitors foreground windows using JNA and visualizes usage statistics with interactive charts.",
    tech_stack: "Java, JavaFX, JNA, Charts",
    image_url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
    github_url: "https://github.com/rakibul-h/app-usage-tracker",
    live_url: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Automated Log Analyzer",
    description:
      "A desktop application that analyzes log files to detect warnings, errors and alerts. Generates automated PDF reports for system administrators.",
    tech_stack: "Python, PDF Generation, Tkinter",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    github_url: "https://github.com/rakibul-h/log-analyzer",
    live_url: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "AI Email Assistant",
    description:
      "An AI automation agent that reads Gmail inbox messages, generates reply drafts using AI and sends the draft to Telegram for human approval before sending.",
    tech_stack: "Python, Gmail API, Telegram Bot API, OpenAI",
    image_url: "https://images.unsplash.com/photo-1526378787940-576a539ba69d",
    github_url: "https://github.com/rakibul-h/ai-email-assistant",
    live_url: "",
    priority: true,
    created_at: new Date().toISOString(),
  },
];

export const mockTools: Tool[] = [
  {
    id: "1",
    name: "AI Email Writer",
    slug: "ai-email-writer",
    description:
      "Generates professional outreach and reply emails using AI. Specify your goal and tone, and get a polished email instantly.",
    icon: "mail",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "SEO Keyword Generator",
    slug: "seo-keyword-generator",
    description:
      "Discovers long-tail keyword opportunities for your niche. Enter a seed topic and get a ready-to-use keyword list.",
    icon: "search",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Text Humanizer",
    slug: "text-humanizer",
    description:
      "Transforms rigid AI-generated text into natural, conversational language that reads like a human wrote it.",
    icon: "edit",
    created_at: new Date().toISOString(),
  },
];

export const mockCertificates: Certificate[] = [
  {
    id: "c-1",
    title: "Google Cybersecurity Certificate",
    issuer: "Google",
    platform: "Coursera",
    description: "Completed practical labs in threat analysis and defensive security workflows.",
    certificate_url: "https://www.coursera.org/",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    issue_date: "2024-01-16",
    priority: true,
    created_at: new Date("2024-01-16").toISOString(),
  },
  {
    id: "c-2",
    title: "Meta Front-End Certificate",
    issuer: "Meta",
    platform: "Coursera",
    description: "Focused on React architecture, UI performance, and responsive interface patterns.",
    certificate_url: "https://www.coursera.org/",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    issue_date: "2025-03-19",
    priority: true,
    created_at: new Date("2025-03-19").toISOString(),
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building AI Agents for Email Automation",
    slug: "ai-agents-email-automation",
    content:
      "AI agents can automate repetitive email workflows by reading your inbox, understanding context, and drafting replies — all without human intervention until approval is needed. In this post I walk through how I built an AI email assistant using Python, the Gmail API, and OpenAI to handle my inbox and route draft replies to Telegram for approval before they are sent.",
    cover_image: "https://images.unsplash.com/photo-1526378787940-576a539ba69d",
    published_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Introduction to RAG: Retrieval Augmented Generation",
    slug: "intro-to-rag",
    content:
      "Retrieval Augmented Generation (RAG) is a technique that enhances Large Language Models by connecting them to external knowledge bases. Instead of relying solely on training data, the model retrieves relevant documents at query time and uses them as context to generate accurate, up-to-date answers. This post covers the fundamentals of RAG architecture, vector databases, and practical implementation patterns.",
    cover_image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Automating Your Development Workflow with Python",
    slug: "automating-dev-workflow-python",
    content:
      "Python is the Swiss army knife of automation. From log analysis and report generation to scheduled tasks and API integrations — Python can automate almost any repetitive workflow in your development environment. This post covers practical automation scripts I use daily, covering file processing, API polling, and automated reporting.",
    cover_image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockSiteSettings: SiteSettings = {
  hero_title: "Build. Automate. Impact.",
  hero_description:
    "CS student at Begum Rokeya University building AI automation tools, backend systems and digital products that solve real problems.",
  about_me: "I'm a Computer Science student at Begum Rokeya University. I actively build software tools, automation systems, and share knowledge about AI agents and modern development technologies.",
  about_description: "My work focuses on bridging the gap between hardware and software through robust backend systems and intuitive digital tools.",
  skills: "Python, JavaScript, Next.js, Django, AI Agents, Automation",
  core_focus: "Builds AI automation agents and RAG systems., Develops full-stack web applications., Creates hardware automation projects.",
  github: "https://github.com/rakibul-h",
  linkedin: "https://linkedin.com/in/rakibul-hasan",
  email: "rakib@example.com",
  phone: "",
  whatsapp: "",
  resume_url: "/resume.pdf",
  profile_image_url: "",
};
