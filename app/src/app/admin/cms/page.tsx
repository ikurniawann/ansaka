"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase-client";

type CmsPage = {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  content_id: Record<string, unknown>;
  content_en: Record<string, unknown>;
  meta_description_id: string | null;
  meta_description_en: string | null;
  is_published: boolean;
};

export default function AdminCmsPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [activeSlug, setActiveSlug] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    title_id: "", title_en: "", content_id: "", content_en: "",
    meta_id: "", meta_en: "", is_published: true,
  });

  async function loadPages() {
    const { data } = await supabase
      .from("cms_pages")
      .select("id, slug, title_id, title_en, content_id, content_en, meta_description_id, meta_description_en, is_published")
      .order("slug");
    setPages((data ?? []) as CmsPage[]);
    setLoading(false);
  }

  useEffect(() => { loadPages(); }, []);

  useEffect(() => {
    const page = pages.find((p) => p.slug === activeSlug);
    if (page) {
      setForm({
        title_id: page.title_id,
        title_en: page.title_en,
        content_id: JSON.stringify(page.content_id, null, 2),
        content_en: JSON.stringify(page.content_en, null, 2),
        meta_id: page.meta_description_id ?? "",
        meta_en: page.meta_description_en ?? "",
        is_published: page.is_published,
      });
    }
  }, [activeSlug, pages]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    let contentId, contentEn;
    try {
      contentId = JSON.parse(form.content_id || "{}");
      contentEn = JSON.parse(form.content_en || "{}");
    } catch {
      setMessage("Error: Content ID atau EN bukan JSON valid.");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("cms_pages")
      .update({
        title_id: form.title_id,
        title_en: form.title_en,
        content_id: contentId,
        content_en: contentEn,
        meta_description_id: form.meta_id || null,
        meta_description_en: form.meta_en || null,
        is_published: form.is_published,
      })
      .eq("slug", activeSlug);
    if (error) { setMessage("Error: " + error.message); }
    else { setMessage("Tersimpan."); await loadPages(); }
    setSaving(false);
  }

  const slugs = ["home", "services", "about", "contact"];

  return (
    <div className="px-8 py-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">CMS Pages</h1>

      {message && (
        <Alert className="mt-4 max-w-2xl" variant={message.startsWith("Error") ? "destructive" : "success"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[180px_1fr]">
          {/* Page list */}
          <div className="space-y-1">
            {slugs.map((slug) => (
              <button
                key={slug}
                onClick={() => setActiveSlug(slug)}
                className={`w-full rounded-[0.875rem] px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeSlug === slug
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                /{slug}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="space-y-6 max-w-2xl">
            <Tabs defaultValue="id">
              <TabsList>
                <TabsTrigger value="id">Bahasa Indonesia</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="meta">Meta & Publish</TabsTrigger>
              </TabsList>

              <TabsContent value="id" className="space-y-4">
                <div className="space-y-2">
                  <Label>Judul (ID)</Label>
                  <Input value={form.title_id} onChange={(e) => setForm(f => ({ ...f, title_id: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Content JSON (ID)</Label>
                  <Textarea
                    value={form.content_id}
                    onChange={(e) => setForm(f => ({ ...f, content_id: e.target.value }))}
                    className="font-mono text-xs min-h-[200px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input value={form.title_en} onChange={(e) => setForm(f => ({ ...f, title_en: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Content JSON (EN)</Label>
                  <Textarea
                    value={form.content_en}
                    onChange={(e) => setForm(f => ({ ...f, content_en: e.target.value }))}
                    className="font-mono text-xs min-h-[200px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="meta" className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Description (ID)</Label>
                  <Textarea value={form.meta_id} onChange={(e) => setForm(f => ({ ...f, meta_id: e.target.value }))} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description (EN)</Label>
                  <Textarea value={form.meta_en} onChange={(e) => setForm(f => ({ ...f, meta_en: e.target.value }))} rows={3} />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={form.is_published}
                    onChange={(e) => setForm(f => ({ ...f, is_published: e.target.checked }))}
                    className="size-4"
                  />
                  <Label htmlFor="published">Publish halaman</Label>
                </div>
              </TabsContent>
            </Tabs>

            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Simpan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
