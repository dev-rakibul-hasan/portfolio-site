"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/types";

type FormState = Omit<BlogPost, "id">;

const emptyForm: FormState = {
  title: "",
  slug: "",
  content: "",
  cover_image: "",
  published_at: new Date().toISOString().slice(0, 10),
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchPosts() {
    const res = await fetch("/api/admin/blog");
    if (res.ok) {
      setPosts(await res.json());
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  function startEdit(post: BlogPost) {
    setEditId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      cover_image: post.cover_image ?? "",
      published_at: post.published_at.slice(0, 10),
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setError("");
  }

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = editId ? `/api/admin/blog/${editId}` : "/api/admin/blog";
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
      await fetchPosts();
      cancelEdit();
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Manage Blog</h1>

      {/* Form */}
      <section className="glass rounded-3xl p-6">
        <h2 className="text-xl">{editId ? "Edit Post" : "New Blog Post"}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Post title"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm({ ...form, title, slug: editId ? form.slug : autoSlug(title) });
            }}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none sm:col-span-2"
          />
          <input
            required
            placeholder="Slug (e.g. intro-to-rag)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <input
            placeholder="Cover image URL"
            value={form.cover_image}
            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <textarea
            required
            placeholder="Content (Markdown or plain text)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={8}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none sm:col-span-2"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-[var(--muted)]">Publish date</label>
            <input
              type="date"
              value={form.published_at}
              onChange={(e) => setForm({ ...form, published_at: e.target.value })}
              className="rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm outline-none"
            />
          </div>
          {error && <p className="text-sm text-rose-400 sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : editId ? "Update Post" : "Publish Post"}
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
        {posts.length === 0 && (
          <p className="text-sm text-[var(--muted)]">No posts yet. Write your first post above.</p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="glass flex flex-wrap items-start justify-between gap-3 rounded-2xl p-5">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{post.title}</p>
              <p className="mt-0.5 text-xs text-[var(--brand)]">/blog/{post.slug}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">{post.content}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(post)}
                className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-xs font-semibold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(post.id)}
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
