"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase-client";

type PricingTier = {
  id: string;
  name: string;
  description: string | null;
  min_links_inclusive: number;
  max_links_inclusive: number | null;
  price_per_link_idr: number;
  is_active: boolean;
  sort_order: number;
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function AdminPricingPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", min_links: 0, max_links: "", price_per_link: 0, sort_order: 10,
  });

  async function loadTiers() {
    const { data } = await supabase
      .from("pricing_tiers")
      .select("*")
      .order("sort_order");
    setTiers((data ?? []) as PricingTier[]);
    setLoading(false);
  }

  useEffect(() => { loadTiers(); }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from("pricing_tiers").insert({
      name: form.name,
      description: form.description || null,
      min_links_inclusive: form.min_links,
      max_links_inclusive: form.max_links ? Number(form.max_links) : null,
      price_per_link_idr: form.price_per_link,
      sort_order: form.sort_order,
    });
    if (error) { setMessage("Error: " + error.message); }
    else {
      setMessage("Tier berhasil ditambahkan.");
      setShowForm(false);
      await loadTiers();
    }
    setSaving(false);
  }

  async function deleteTier(id: string) {
    if (!confirm("Hapus tier ini?")) return;
    await supabase.from("pricing_tiers").delete().eq("id", id);
    await loadTiers();
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Pricing Tiers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Skema harga fleksibel: misalnya 30 link pertama gratis, sisanya berbayar per link.
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus className="size-4" />
          {showForm ? "Batal" : "Tambah Tier"}
        </Button>
      </div>

      {message && (
        <Alert className="mt-4" variant={message.startsWith("Error") ? "destructive" : "success"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 rounded-[1.5rem] border border-border bg-card p-6 space-y-4 max-w-lg">
          <h3 className="font-medium">Tier Baru</h3>
          <div className="space-y-2">
            <Label>Nama Tier</Label>
            <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Free Tier" required />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi (opsional)</Label>
            <Input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Links (inklusif)</Label>
              <Input type="number" value={form.min_links} onChange={(e) => setForm(f => ({ ...f, min_links: Number(e.target.value) }))} required />
            </div>
            <div className="space-y-2">
              <Label>Max Links (kosong = tak terbatas)</Label>
              <Input type="number" value={form.max_links} onChange={(e) => setForm(f => ({ ...f, max_links: e.target.value }))} placeholder="30" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Harga per Link (IDR)</Label>
            <Input type="number" value={form.price_per_link} onChange={(e) => setForm(f => ({ ...f, price_per_link: Number(e.target.value) }))} required />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : "Simpan"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="mt-8 space-y-3">
          {tiers.map((tier) => (
            <div key={tier.id} className="flex items-center gap-6 rounded-[1.25rem] border border-border bg-card px-6 py-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{tier.name}</p>
                  <Badge variant={tier.is_active ? "success" : "muted"} className="text-xs">
                    {tier.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                {tier.description && <p className="text-xs text-muted-foreground">{tier.description}</p>}
              </div>
              <div className="text-sm text-muted-foreground">
                Link {tier.min_links_inclusive}–{tier.max_links_inclusive ?? "∞"}
              </div>
              <div className="text-sm font-medium">
                {tier.price_per_link_idr === 0 ? "Gratis" : `${formatRupiah(tier.price_per_link_idr)}/link`}
              </div>
              <Button
                variant="ghost" size="icon"
                onClick={() => deleteTier(tier.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {tiers.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada pricing tier.</p>
          )}
        </div>
      )}
    </div>
  );
}
