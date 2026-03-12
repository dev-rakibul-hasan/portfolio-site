"use client";

import { useEffect, useState } from "react";
import type { Tool } from "@/lib/types";

type FormState = Omit<Tool, "id" | "created_at">;

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  icon: "",
};

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTools() {
    const res = await fetch("/api/admin/tools");
    if (res.ok) {
      setTools(await res.json());
    }
  }

  useEffect(() => {
    fetchTools();
  }, []);

  function startEdit(tool: Tool) {
    setEditId(tool.id);
    setForm({
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      icon: tool.icon ?? "",
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setError("");
  }

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = editId ? `/api/admin/tools/${editId}` : "/api/admin/tools";
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
      await fetchTools();
      cancelEdit();
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tool?")) return;
    const res = await fetch(`/api/admin/tools/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTools((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Manage Tools</h1>

      {/* Form */}
      <section className="glass rounded-3xl p-6">
        <h2 className="text-xl">{editId ? "Edit Tool" : "Add New Tool"}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Tool name"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm({ ...form, name, slug: editId ? form.slug : autoSlug(name) });
            }}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <input
            required
            placeholder="Slug (e.g. ai-email-writer)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
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
            placeholder="Icon name (e.g. mail, search, edit)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          {error && <p className="text-sm text-rose-400 sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : editId ? "Update Tool" : "Add Tool"}
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
        {tools.length === 0 && (
          <p className="text-sm text-[var(--muted)]">No tools yet. Add your first tool above.</p>
        )}
        {tools.map((tool) => (
          <div key={tool.id} className="glass flex flex-wrap items-start justify-between gap-3 rounded-2xl p-5">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{tool.name}</p>
              <p className="mt-0.5 text-xs text-[var(--brand)]">/tools/{tool.slug}</p>
              <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">{tool.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(tool)}
                className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-xs font-semibold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(tool.id)}
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
