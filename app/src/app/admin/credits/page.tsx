"use client";

import { DragEvent, FormEvent, useEffect, useState } from "react";
import { GripVertical, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [reordering, setReordering] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);

  const [form, setForm] = useState({
    name: "", credits: 50, price_idr: 5000000, description: "", sort_order: 10,
  });
  const [editForm, setEditForm] = useState({
    name: "",
    credits: 50,
    price_idr: 5000000,
    description: "",
    is_active: true,
  });

  async function loadPackages() {
    const { data } = await supabase
      .from("credit_packages")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
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

  function openEditDialog(pkg: CreditPackage) {
    setEditingPackage(pkg);
    setEditForm({
      name: pkg.name,
      credits: pkg.credits,
      price_idr: pkg.price_idr,
      description: pkg.description ?? "",
      is_active: pkg.is_active,
    });
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!editingPackage) return;

    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("credit_packages")
      .update({
        name: editForm.name.trim(),
        credits: editForm.credits,
        price_idr: editForm.price_idr,
        description: editForm.description.trim() || null,
        is_active: editForm.is_active,
      })
      .eq("id", editingPackage.id);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Paket berhasil diperbarui.");
      setEditingPackage(null);
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

  function movePackage(list: CreditPackage[], fromId: string, toId: string) {
    const fromIndex = list.findIndex((pkg) => pkg.id === fromId);
    const toIndex = list.findIndex((pkg) => pkg.id === toId);

    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return list;

    const next = [...list];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  }

  async function persistOrder(nextPackages: CreditPackage[]) {
    setReordering(true);
    setMessage(null);

    const updates = nextPackages.map((pkg, index) =>
      supabase
        .from("credit_packages")
        .update({ sort_order: index + 1 })
        .eq("id", pkg.id),
    );

    const results = await Promise.all(updates);
    const error = results.find((result) => result.error)?.error;

    if (error) {
      setMessage("Error: " + error.message);
      await loadPackages();
    } else {
      setPackages(nextPackages.map((pkg, index) => ({ ...pkg, sort_order: index + 1 })));
      setMessage("Urutan paket berhasil disimpan.");
    }

    setReordering(false);
  }

  async function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const nextPackages = movePackage(packages, draggedId, targetId);
    setDraggedId(null);
    setDragOverId(null);

    if (nextPackages !== packages) {
      setPackages(nextPackages);
      await persistOrder(nextPackages);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>, targetId: string) {
    event.preventDefault();
    if (targetId !== dragOverId) setDragOverId(targetId);
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Paket Kredit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag card untuk mengubah urutan tampil di halaman pembelian kredit.
          </p>
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
            <div
              key={pkg.id}
              draggable={!reordering}
              onDragStart={() => setDraggedId(pkg.id)}
              onDragOver={(event) => handleDragOver(event, pkg.id)}
              onDragLeave={() => setDragOverId(null)}
              onDrop={() => handleDrop(pkg.id)}
              onDragEnd={() => {
                setDraggedId(null);
                setDragOverId(null);
              }}
              className={[
                "rounded-[1.5rem] border p-5 transition-all",
                pkg.is_active ? "border-border bg-card" : "border-border/40 bg-card/40 opacity-60",
                draggedId === pkg.id ? "scale-[0.98] opacity-50" : "",
                dragOverId === pkg.id && draggedId !== pkg.id ? "border-primary shadow-ink-soft ring-2 ring-primary/20" : "",
                reordering ? "cursor-wait" : "cursor-grab active:cursor-grabbing",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="size-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{pkg.name}</p>
                    <p className="text-xs text-muted-foreground">Urutan {pkg.sort_order}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={pkg.is_active ? "success" : "muted"} className="text-xs">
                    {pkg.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
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
                  variant="outline"
                  size="default"
                  onClick={() => openEditDialog(pkg)}
                  className="flex-1 text-xs"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
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

      <Dialog open={!!editingPackage} onOpenChange={(open) => !open && setEditingPackage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Paket Kredit</DialogTitle>
            <DialogDescription>
              Perubahan akan langsung terlihat di halaman pembelian kredit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Paket</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jumlah Kredit</Label>
                <Input
                  type="number"
                  min={1}
                  value={editForm.credits}
                  onChange={(e) => setEditForm((f) => ({ ...f, credits: Number(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Harga (IDR)</Label>
                <Input
                  type="number"
                  min={0}
                  value={editForm.price_idr}
                  onChange={(e) => setEditForm((f) => ({ ...f, price_idr: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>

            <label className="flex items-center gap-3 rounded-[0.875rem] border border-border bg-muted/40 px-4 py-3 text-sm">
              <input
                checked={editForm.is_active}
                className="size-4 accent-foreground"
                onChange={(e) => setEditForm((f) => ({ ...f, is_active: e.target.checked }))}
                type="checkbox"
              />
              Paket aktif dan tampil di halaman pembelian
            </label>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingPackage(null)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
