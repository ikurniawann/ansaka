"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase-client";

type FormulaRow = {
  id: string;
  version: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  notes: string | null;
};

export default function AdminFormulasPage() {
  const [formulas, setFormulas] = useState<FormulaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadFormulas() {
    const { data } = await supabase
      .from("oam_formulas")
      .select("id, version, description, is_active, created_at, notes")
      .order("created_at", { ascending: false });
    setFormulas((data ?? []) as FormulaRow[]);
    setLoading(false);
  }

  useEffect(() => { loadFormulas(); }, []);

  async function activate(id: string) {
    setActivating(id);
    setMessage(null);
    // Deactivate all, then activate selected
    const { error: e1 } = await supabase
      .from("oam_formulas")
      .update({ is_active: false })
      .neq("id", id);
    const { error: e2 } = await supabase
      .from("oam_formulas")
      .update({ is_active: true })
      .eq("id", id);
    if (e1 || e2) {
      setMessage("Error: " + (e1 ?? e2)?.message);
    } else {
      setMessage("Formula aktif diperbarui.");
      await loadFormulas();
    }
    setActivating(null);
  }

  return (
    <div className="px-8 py-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">OAM Formula Editor</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-lg">
        Hanya <strong className="text-foreground">satu formula yang aktif</strong> pada satu waktu. Formula aktif
        digunakan oleh semua survey baru. Mengubah formula tidak mempengaruhi respons yang sudah ada.
      </p>

      {message && (
        <Alert className="mt-4 max-w-lg" variant={message.startsWith("Error") ? "destructive" : "success"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="mt-8 space-y-3 max-w-2xl">
          {formulas.map((f) => (
            <div
              key={f.id}
              className={`rounded-[1.25rem] border p-5 ${f.is_active ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-semibold">{f.version}</p>
                    {f.is_active && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="size-3" />
                        Aktif
                      </Badge>
                    )}
                  </div>
                  {f.description && <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>}
                  {f.notes && <p className="mt-1 text-xs text-muted-foreground">{f.notes}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Dibuat {new Date(f.created_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
                {!f.is_active && (
                  <Button
                    variant="outline" size="default"
                    onClick={() => activate(f.id)}
                    disabled={activating === f.id}
                  >
                    {activating === f.id ? <Loader2 className="size-4 animate-spin" /> : "Aktifkan"}
                  </Button>
                )}
              </div>
            </div>
          ))}
          {formulas.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada formula OAM.</p>
          )}
        </div>
      )}

      <div className="mt-8 rounded-[1.5rem] border border-border bg-card p-6 max-w-2xl">
        <h3 className="font-medium">Catatan</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Untuk menambah formula baru dengan weight map yang berbeda, tambahkan row baru ke tabel{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">oam_formulas</code> via
          Supabase SQL Editor atau migration baru. Pastikan hanya satu formula yang diset{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">is_active = true</code>.
        </p>
      </div>
    </div>
  );
}
