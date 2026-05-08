"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Copy, ExternalLink, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase-client";

type BatchRow = {
  id: string;
  name: string | null;
  status: "draft" | "active" | "closed";
  credits_allocated: number;
  credits_used: number;
  created_at: string;
  unique_link_token: string;
};

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const { data: profile } = await supabase
        .from("users")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();

      if (!profile?.organization_id) { setLoading(false); return; }

      const { data } = await supabase
        .from("survey_batches")
        .select("id, name, status, credits_allocated, credits_used, created_at, unique_link_token")
        .eq("organization_id", profile.organization_id)
        .order("created_at", { ascending: false });

      setBatches((data ?? []) as BatchRow[]);
      setLoading(false);
    })();
  }, [router]);

  function copyLink(token: string, id: string) {
    const url = `${window.location.origin}/survey/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function statusBadge(status: string) {
    if (status === "active")  return <Badge variant="success">Aktif</Badge>;
    if (status === "closed")  return <Badge variant="muted">Selesai</Badge>;
    return <Badge variant="outline">Draft</Badge>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Survey Management</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Batch Survey</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/batches/new">
            <Plus className="size-4" />
            Batch Baru
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {batches.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border p-16 text-center">
            <BarChart3 className="mx-auto size-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">Belum ada batch</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Buat batch untuk mulai mengumpulkan respons survey OAM.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/batches/new">
                <Plus className="size-4" />
                Buat Batch
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-border bg-card">
            {/* Header */}
            <div className="grid grid-cols-[1fr_120px_160px_120px_160px] border-b border-border px-6 py-3 text-xs font-medium text-muted-foreground">
              <span>Nama Batch</span>
              <span>Status</span>
              <span>Kredit</span>
              <span>Tanggal</span>
              <span>Aksi</span>
            </div>

            {batches.map((batch, idx) => (
              <div
                key={batch.id}
                className={[
                  "grid grid-cols-[1fr_120px_160px_120px_160px] items-center px-6 py-4 transition-colors hover:bg-muted/30",
                  idx < batches.length - 1 ? "border-b border-border/50" : "",
                ].join(" ")}
              >
                <div>
                  <Link
                    href={`/dashboard/batches/${batch.id}`}
                    className="font-medium hover:underline underline-offset-2"
                  >
                    {batch.name ?? "Batch tanpa nama"}
                  </Link>
                  <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                    token: {batch.unique_link_token.slice(0, 12)}…
                  </p>
                </div>

                <div>{statusBadge(batch.status)}</div>

                <div className="text-sm">
                  <span className="font-medium">{batch.credits_used}</span>
                  <span className="text-muted-foreground"> / {batch.credits_allocated}</span>
                  <p className="text-xs text-muted-foreground">digunakan</p>
                </div>

                <div className="text-xs text-muted-foreground">
                  {new Date(batch.created_at).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </div>

                <div className="flex gap-2">
                  {batch.status === "active" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyLink(batch.unique_link_token, batch.id)}
                      title="Salin link survey"
                    >
                      {copiedId === batch.id ? (
                        <span className="text-xs text-green-600">✓</span>
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </Button>
                  )}
                  <Button asChild variant="ghost" size="icon" title="Lihat detail">
                    <Link href={`/dashboard/batches/${batch.id}`}>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </Button>
                  {batch.status === "closed" && (
                    <Button asChild variant="outline" size="default">
                      <Link href={`/dashboard/batches/${batch.id}/results`}>
                        Lihat Hasil
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
