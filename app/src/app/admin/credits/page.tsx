"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase-client";

type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  price_idr: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function AdminCreditsPage() {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "", credits: 50, price_idr: 5000000, description: "", sort_order: 10,
  });

  async function loadPackages() {
    const { data } = await supabase
      .from("credit_packages")
      .select("*")
      .order("sort_order");
    setPackages((data ?? []) as CreditPackage[]);
    setLoading(false);
  }

  useEffect(() => { loadPackages(); }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from("credit_packages").insert({
      name: form.name,
      credits: form.credits,
      price_idr: form.price_idr,
      description: form.description || null,
      sort_order: form.sort_order,
    });
    if (error) { setMessage("Error: " + error.message); }
    else {
      setMessage("Paket berhasil ditambahkan.");
      setShowForm(false);
      setForm({ name: "", credits: 50, price_idr: 5000000, description: "", sort_order: 10 });
      await loadPackages();
    }
    setSaving(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("credit_packages").update({ is_active: !current }).eq("id", id);
    await loadPackages();
  }

  async function deletePackage(id: string) {
    if (!confirm("Hapus paket ini?")) return;
    await supabase.from("credit_packages").delete().eq("id", id);
    await loadPackages();
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Paket Kredit</h1>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="size-4" />
          {showForm ? "Batal" : "Tambah Paket"}
        </Button>
      </div>

      {message && (
        <Alert className="mt-4" variant={message.startsWith("Error") ? "destructive" : "success"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 rounded-[1.5rem] border border-border bg-card p-6 space-y-4 max-w-lg">
          <h3 className="font-medium">Paket Baru</h3>
          <div className="space-y-2">
            <Label>Nama Paket</Label>
            <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Business" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jumlah Kredit</Label>
              <Input type="number" value={form.credits} onChange={(e) => setForm(f => ({ ...f, credits: Number(e.target.value) }))} required />
            </div>
            <div className="space-y-2">
              <Label>Harga (IDR)</Label>
              <Input type="number" value={form.price_idr} onChange={(e) => setForm(f => ({ ...f, price_idr: Number(e.target.value) }))} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi (opsional)</Label>
            <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Urutan Tampil</Label>
            <Input type="number" value={form.sort_order} onChange={(e) => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="max-w-[120px]" />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : "Simpan Paket"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`rounded-[1.5rem] border ${pkg.is_active ? "border-border bg-card" : "border-border/40 bg-card/40 opacity-60"} p-5`}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{pkg.name}</p>
                <Badge variant={pkg.is_active ? "success" : "muted"} className="text-xs">
                  {pkg.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              {pkg.description && <p className="mt-1 text-xs text-muted-foreground">{pkg.description}</p>}
              <p className="mt-3 text-3xl font-bold">{pkg.credits.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">kredit</p>
              <p className="mt-2 text-base font-semibold">{formatRupiah(pkg.price_idr)}</p>
              <p className="text-xs text-muted-foreground">
                {formatRupiah(Math.round(pkg.price_idr / pkg.credits))}/kredit
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline" size="default"
                  onClick={() => toggleActive(pkg.id, pkg.is_active)}
                  className="flex-1 text-xs"
                >
                  {pkg.is_active ? "Nonaktifkan" : "Aktifkan"}
                </Button>
                <Button
                  variant="ghost" size="icon"
                  onClick={() => deletePackage(pkg.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
