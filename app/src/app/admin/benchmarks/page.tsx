"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase-client";
import { DRIVERS } from "@/lib/oam-constants";

type BenchmarkRow = {
  id: string;
  industry: string;
  size_range: string | null;
  driver_id: string;
  benchmark_score: number;
  source: string | null;
  effective_from: string;
  is_active: boolean;
};

export default function AdminBenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    industry: "", size_range: "", driver_id: "D1",
    benchmark_score: 3.0, source: "", effective_from: new Date().toISOString().split("T")[0],
  });

  async function loadBenchmarks() {
    const { data } = await supabase
      .from("industry_benchmarks")
      .select("*")
      .order("industry")
      .order("driver_id");
    setBenchmarks((data ?? []) as BenchmarkRow[]);
    setLoading(false);
  }

  useEffect(() => { loadBenchmarks(); }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from("industry_benchmarks").insert({
      industry: form.industry,
      size_range: form.size_range || null,
      driver_id: form.driver_id,
      benchmark_score: form.benchmark_score,
      source: form.source || null,
      effective_from: form.effective_from,
    });
    if (error) { setMessage("Error: " + error.message); }
    else {
      setMessage("Benchmark ditambahkan.");
      setShowForm(false);
      await loadBenchmarks();
    }
    setSaving(false);
  }

  async function deleteBenchmark(id: string) {
    if (!confirm("Hapus benchmark ini?")) return;
    await supabase.from("industry_benchmarks").delete().eq("id", id);
    await loadBenchmarks();
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Industry Benchmarks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Data benchmark untuk perbandingan hasil OAM per driver dan industri.
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="size-4" />
          {showForm ? "Batal" : "Tambah Benchmark"}
        </Button>
      </div>

      {message && (
        <Alert className="mt-4" variant={message.startsWith("Error") ? "destructive" : "success"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 rounded-[1.5rem] border border-border bg-card p-6 space-y-4 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Industri</Label>
              <Input value={form.industry} onChange={(e) => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="Manufacturing" required />
            </div>
            <div className="space-y-2">
              <Label>Ukuran Perusahaan (opsional)</Label>
              <Input value={form.size_range} onChange={(e) => setForm(f => ({ ...f, size_range: e.target.value }))} placeholder="100-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Driver</Label>
              <Select value={form.driver_id} onValueChange={(v) => setForm(f => ({ ...f, driver_id: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DRIVERS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.id} – {d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Benchmark Score (1–4)</Label>
              <Input
                type="number" step="0.01" min={1} max={4}
                value={form.benchmark_score}
                onChange={(e) => setForm(f => ({ ...f, benchmark_score: Number(e.target.value) }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sumber (opsional)</Label>
              <Input value={form.source} onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))} placeholder="ANSAKA Survey 2024" />
            </div>
            <div className="space-y-2">
              <Label>Berlaku Dari</Label>
              <Input type="date" value={form.effective_from} onChange={(e) => setForm(f => ({ ...f, effective_from: e.target.value }))} required />
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : "Simpan"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="mt-8 rounded-[1.5rem] border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Industri</TableHead>
                <TableHead>Ukuran</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Sumber</TableHead>
                <TableHead>Berlaku</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benchmarks.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.industry}</TableCell>
                  <TableCell className="text-muted-foreground">{b.size_range ?? "-"}</TableCell>
                  <TableCell><span className="font-mono text-xs">{b.driver_id}</span></TableCell>
                  <TableCell><span className="font-bold">{Number(b.benchmark_score).toFixed(2)}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{b.source ?? "-"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{b.effective_from}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => deleteBenchmark(b.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {benchmarks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    Belum ada data benchmark.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
