"use client";

import { FormEvent, useEffect, useState } from "react";
import { Gift, Loader2, Plus, Save, Trash2 } from "lucide-react";

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

type SignupCreditSetting = {
  enabled: boolean;
  credits: number;
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function AdminPricingPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSetting, setSavingSetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [settingMessage, setSettingMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [signupCreditSetting, setSignupCreditSetting] = useState<SignupCreditSetting>({
    enabled: true,
    credits: 30,
  });
  const [form, setForm] = useState({
    name: "", description: "", min_links: 0, max_links: "", price_per_link: 0, sort_order: 10,
  });

  async function loadTiers() {
    const [{ data }, settingRes] = await Promise.all([
      supabase
        .from("pricing_tiers")
        .select("*")
        .order("sort_order"),
      supabase
        .from("platform_settings")
        .select("value")
        .eq("key", "signup_free_credits")
        .maybeSingle(),
    ]);

    setTiers((data ?? []) as PricingTier[]);
    const settingValue = settingRes.data?.value as Partial<SignupCreditSetting> | undefined;
    setSignupCreditSetting({
      enabled: settingValue?.enabled ?? true,
      credits: Number(settingValue?.credits ?? 30),
    });
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

  async function saveSignupCreditSetting(event: FormEvent) {
    event.preventDefault();
    setSavingSetting(true);
    setSettingMessage(null);

    const normalizedCredits = Math.max(0, Math.floor(Number(signupCreditSetting.credits) || 0));
    const { error } = await supabase
      .from("platform_settings")
      .upsert({
        key: "signup_free_credits",
        value: {
          enabled: signupCreditSetting.enabled,
          credits: normalizedCredits,
        },
        description: "Free credits granted to a new corporate workspace during first registration.",
      });

    if (error) {
      setSettingMessage("Error: " + error.message);
    } else {
      setSignupCreditSetting((current) => ({ ...current, credits: normalizedCredits }));
      setSettingMessage("Konfigurasi free credit berhasil disimpan.");
    }

    setSavingSetting(false);
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

      <form
        onSubmit={saveSignupCreditSetting}
        className="mt-6 rounded-[1.5rem] border border-border bg-card p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <Gift className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Signup Free Credit</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Kredit gratis untuk perusahaan yang baru pertama kali registrasi. Nilai ini dipakai otomatis
                saat corporate admin pertama membuat workspace.
              </p>
            </div>
          </div>
          <Badge variant={signupCreditSetting.enabled ? "success" : "muted"}>
            {signupCreditSetting.enabled ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[180px_1fr_auto] sm:items-end">
          <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-muted/40 px-4 py-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={signupCreditSetting.enabled}
              onChange={(event) => setSignupCreditSetting((current) => ({
                ...current,
                enabled: event.target.checked,
              }))}
              className="size-4 accent-primary"
            />
            Free credit aktif
          </label>
          <div className="space-y-2">
            <Label>Jumlah Kredit Gratis</Label>
            <Input
              type="number"
              min={0}
              value={signupCreditSetting.credits}
              onChange={(event) => setSignupCreditSetting((current) => ({
                ...current,
                credits: Number(event.target.value),
              }))}
            />
          </div>
          <Button type="submit" disabled={savingSetting}>
            {savingSetting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Simpan Setting
          </Button>
        </div>

        {settingMessage && (
          <Alert className="mt-4" variant={settingMessage.startsWith("Error") ? "destructive" : "success"}>
            <AlertDescription>{settingMessage}</AlertDescription>
          </Alert>
        )}
      </form>

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
