"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/image-uploader";
import type { Certificate } from "@/lib/types";

type FormState = Omit<Certificate, "id" | "created_at">;

const emptyForm: FormState = {
  title: "",
  issuer: "",
  platform: "",
  description: "",
  certificate_url: "",
  image_url: "",
  issue_date: "",
  priority: true,
};

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchCertificates() {
    const res = await fetch("/api/admin/certificates");
    if (res.ok) {
      setCertificates(await res.json());
    }
  }

  useEffect(() => {
    fetchCertificates();
  }, []);

  function startEdit(certificate: Certificate) {
    setEditId(certificate.id);
    setForm({
      title: certificate.title,
      issuer: certificate.issuer,
      platform: certificate.platform,
      description: certificate.description,
      certificate_url: certificate.certificate_url ?? "",
      image_url: certificate.image_url ?? "",
      issue_date: certificate.issue_date,
      priority: Boolean(certificate.priority),
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const url = editId ? `/api/admin/certificates/${editId}` : "/api/admin/certificates";
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
      await fetchCertificates();
      cancelEdit();
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this certificate?")) return;
    const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCertificates((prev) => prev.filter((certificate) => certificate.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Manage Certificates</h1>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-xl">{editId ? "Edit Certificate" : "Add New Certificate"}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Certificate Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none sm:col-span-2"
          />
          <input
            required
            placeholder="Issuer"
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <input
            required
            placeholder="Platform"
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <textarea
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none sm:col-span-2"
          />
          <input
            type="url"
            placeholder="Certificate URL"
            value={form.certificate_url}
            onChange={(e) => setForm({ ...form, certificate_url: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <input
            type="date"
            required
            value={form.issue_date}
            onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
            className="rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <div className="sm:col-span-2">
            <ImageUploader
              currentUrl={form.image_url}
              onUploadSuccess={(url) => setForm({ ...form, image_url: url })}
              label="Certificate Image"
              shape="square"
              uploadFolder="certificate-images"
            />
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(form.priority)}
              onChange={(e) => setForm({ ...form, priority: e.target.checked })}
              className="h-4 w-4"
            />
            Show as priority flag in timeline
          </label>
          {error ? <p className="text-sm text-rose-400 sm:col-span-2">{error}</p> : null}
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : editId ? "Update Certificate" : "Add Certificate"}
            </button>
            {editId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-[var(--line)] px-5 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="space-y-3">
        {certificates.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No certificates yet. Add your first certificate above.</p>
        ) : null}
        {certificates.map((certificate) => (
          <div key={certificate.id} className="glass flex flex-wrap items-start justify-between gap-3 rounded-2xl p-5">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{certificate.title}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {certificate.issuer} • {certificate.platform}
              </p>
              <p className="mt-1 text-xs text-[var(--brand)]">
                {new Date(certificate.issue_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">{certificate.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(certificate)}
                className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-xs font-semibold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(certificate.id)}
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
