"use client";

import { useEffect, useState } from "react";
import type { ContactMessage } from "@/lib/types";
import { Reveal } from "@/components/reveal";
import { Mail, Trash2, User, Clock } from "lucide-react";

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      if (res.ok) {
        setMessages(await res.json());
      } else {
        setError("Failed to fetch messages.");
      }
    } catch {
      setError("An error occurred while fetching messages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete message.");
      }
    } catch {
      alert("An error occurred while deleting.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <div className="px-4 py-1.5 glass rounded-full text-xs font-semibold text-brand">
          {messages.length} Messages
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-muted animate-pulse">Loading messages...</p>
        </div>
      ) : error ? (
        <div className="glass border-rose-500/20 rounded-3xl p-12 text-center text-rose-400">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-muted">No messages yet. They will appear here when someone contacts you.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((message, index) => (
            <Reveal key={message.id} delay={index * 0.05}>
              <div className="glass group relative overflow-hidden rounded-3xl p-6 transition-all hover:bg-white/5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-brand font-medium">
                        <User className="h-4 w-4" />
                        {message.name}
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Mail className="h-4 w-4" />
                        {message.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted/60">
                        <Clock className="h-4 w-4" />
                        {new Date(message.created_at).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="prose prose-invert max-w-none text-muted leading-relaxed bg-background/30 rounded-2xl p-4 border border-border/30">
                      {message.message}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(message.id)}
                    className="self-end md:self-start rounded-xl p-3 text-rose-400 transition-colors hover:bg-rose-500/10"
                    title="Delete message"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
