"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { ImageUploader } from "@/components/image-uploader";

const defaultSettings: SiteSettings = {
  hero_title: "",
  hero_description: "",
  about_me: "",
  about_description: "",
  skills: "",
  core_focus: "",
  github: "",
  linkedin: "",
  email: "",
  phone: "",
  whatsapp: "",
  resume_url: "",
  profile_image_url: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.hero_title !== undefined) {
          setForm(data as SiteSettings);
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save settings.");
    } else {
      setSaved(true);
    }

    setLoading(false);
  }

  const fields: { key: keyof SiteSettings; label: string; placeholder: string; type?: string }[] = [
    { key: "hero_title", label: "Hero Title", placeholder: "Build. Automate. Impact." },
    { key: "hero_description", label: "Hero Description", placeholder: "Short tagline shown below the title..." },
    { key: "profile_image_url", label: "Profile Image URL", placeholder: "https://example.com/me.png or /profile.png" },
    { key: "about_me", label: "About Me (Rich Intro)", placeholder: "Detailed introduction about yourself..." },
    { key: "about_description", label: "About Description (Sub-text)", placeholder: "Supporting description for the about section..." },
    { key: "skills", label: "Skills (comma-separated)", placeholder: "Python, Next.js, AI Agents..." },
    { key: "core_focus", label: "Core Focus (comma-separated)", placeholder: "Builds AI agents, Develops apps..." },
    { key: "github", label: "GitHub URL", placeholder: "https://github.com/username" },
    { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/username" },
    { key: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
    { key: "phone", label: "Phone Number", placeholder: "+880 1234 567890", type: "tel" },
    { key: "whatsapp", label: "WhatsApp Number", placeholder: "+8801234567890", type: "tel" },
    { key: "resume_url", label: "Resume URL", placeholder: "/resume.pdf" },
  ];

  if (fetching) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl">Site Settings</h1>
        <div className="glass rounded-3xl p-6">
          <p className="text-sm text-[var(--muted)]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Site Settings</h1>

      <section className="glass rounded-3xl p-6 sm:p-8">
        <p className="text-sm text-[var(--muted)]">
          Changes here update the hero section, social links and contact information across the site.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {fields.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              {key === "profile_image_url" ? (
                <ImageUploader
                  currentUrl={form.profile_image_url || ""}
                  onUploadSuccess={(url) => setForm({ ...form, profile_image_url: url })}
                  label={label}
                />
              ) : (
                <>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                    {label}
                  </label>
                  {key === "hero_description" ? (
                    <textarea
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      rows={3}
                      className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
                    />
                  ) : (
                    <input
                      type={type ?? "text"}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
                    />
                  )}
                </>
              )}
            </div>
          ))}

          {error && <p className="text-sm text-rose-400">{error}</p>}
          {saved && <p className="text-sm text-emerald-400">Settings saved successfully.</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[var(--brand)] px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </section>
    </div>
  );
}
