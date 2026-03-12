import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const headingFont = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://rakibulhasan.dev"),
  title: {
    default: "Md. Rakibul Hasan | Developer & AI Automation Enthusiast",
    template: "%s | Rakib",
  },
  description:
    "Portfolio of Md. Rakibul Hasan \u2014 CS student at Begum Rokeya University. Building AI automation tools, backend systems, and digital products.",
  keywords: [
    "Rakibul Hasan",
    "Rakib",
    "Portfolio",
    "Next.js",
    "AI Automation",
    "Bangladesh Developer",
    "Python",
    "Django",
    "Supabase",
  ],
  openGraph: {
    title: "Md. Rakibul Hasan | Developer & AI Automation Enthusiast",
    description:
      "CS student building AI agents, automation workflows, and full-stack web applications.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rakibulhasan.dev",
    siteName: "Rakib.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md. Rakibul Hasan | Developer",
    description: "CS student building AI automation tools, backend systems and digital products.",
  },
};

import { getSiteSettings } from "@/lib/queries";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{const t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}",
          }}
        />
        <div className="noise-bg" />
        <SiteHeader profileImageUrl={settings?.profile_image_url} />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
