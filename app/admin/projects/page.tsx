"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

type FormState = Omit<Project, "id" | "created_at">;

const emptyForm: FormState = {
  title: "",
  description: "",
  tech_stack: "",
  image_url: "",
  github_url: "",
  live_url: "",
  priority: false,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchProjects() {
    const res = await fetch("/api/admin/projects");
    if (res.ok) {
      setProjects(await res.json());
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function startEdit(project: Project) {
    setEditId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack,
      image_url: project.image_url ?? "",
      github_url: project.github_url ?? "",
      live_url: project.live_url ?? "",
      priority: Boolean(project.priority),
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = editId ? `/api/admin/projects/${editId}` : "/api/admin/projects";
    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
    } else {
      await fetchProjects();
      cancelEdit();
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Manage Projects</h1>

      {/* Form */}
      <section className="glass rounded-3xl p-6">
        <h2 className="text-xl">{editId ? "Edit Project" : "Add New Project"}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none sm:col-span-2"
          />
          <textarea
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none sm:col-span-2"
          />
          <input
            required
            placeholder="Tech stack (comma-separated)"
            value={form.tech_stack}
            onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <input
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <input
            placeholder="GitHub URL"
            value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <input
            placeholder="Live URL"
            value={form.live_url}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <label className="flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(form.priority)}
              onChange={(e) => setForm({ ...form, priority: e.target.checked })}
              className="h-4 w-4"
            />
            Mark as priority timeline milestone (shows as flag)
          </label>
          {error && <p className="text-sm text-rose-400 sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : editId ? "Update Project" : "Add Project"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-[var(--line)] px-5 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* List */}
      <section className="space-y-3">
        {projects.length === 0 && (
          <p className="text-sm text-[var(--muted)]">No projects yet. Add your first project above.</p>
        )}
        {projects.map((project) => (
          <div key={project.id} className="glass flex flex-wrap items-start justify-between gap-3 rounded-2xl p-5">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{project.title}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{project.tech_stack}</p>
              {project.priority ? <p className="mt-1 text-xs text-[var(--brand)]">Priority milestone</p> : null}
              <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(project)}
                className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-xs font-semibold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project.id)}
                className="rounded-xl border border-rose-400/40 px-3 py-1.5 text-xs font-semibold text-rose-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
