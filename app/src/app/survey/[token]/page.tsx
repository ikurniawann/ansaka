"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase-client";
import { DRIVERS, DRIVER_QUESTIONS } from "@/lib/oam-constants";
import { computeFullScores } from "@/lib/scoring";

type SurveyMeta = {
  batch_id: string;
  batch_name: string;
  credits_remaining: number;
  divisions: { id: string; name: string }[];
};

type Answers = Record<string, Record<string, number>>;   // { D1: { Q1: 3 }, ... }
type OpenEnded = Record<string, string>;                  // { D1: "...", ... }

const SCALE = [
  { value: 1, label: "Sangat Tidak Setuju" },
  { value: 2, label: "Tidak Setuju" },
  { value: 3, label: "Setuju" },
  { value: 4, label: "Sangat Setuju" },
  { value: 0, label: "Tidak Tahu / Tidak Relevan" },
];

export default function SurveyPage() {
  const { token } = useParams<{ token: string }>();
  const contentRef = useRef<HTMLDivElement>(null);

  const [meta, setMeta] = useState<SurveyMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Multi-step state
  const [step, setStep] = useState(0); // 0 = intro, 1..12 = driver, 13 = done
  const [divisionId, setDivisionId] = useState<string>("");
  const [answers, setAnswers] = useState<Answers>({});
  const [openEnded, setOpenEnded] = useState<OpenEnded>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase
      .rpc("get_survey_by_token", { p_token: token })
      .then(({ data, error: e }) => {
        if (e || !data) {
          setError("Survey tidak ditemukan atau sudah tidak aktif.");
        } else {
          setMeta(data as SurveyMeta);
        }
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (loading) return;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      contentRef.current?.focus({ preventScroll: true });
    });
  }, [loading, step, submitted]);

  function setAnswer(driver: string, qIdx: number, value: number) {
    setAnswers((prev) => ({
      ...prev,
      [driver]: { ...(prev[driver] ?? {}), [`Q${qIdx + 1}`]: value },
    }));
  }

  function getAnswer(driver: string, qIdx: number): number | undefined {
    return answers[driver]?.[`Q${qIdx + 1}`];
  }

  function currentDriverId() {
    return DRIVERS[step - 1]?.id ?? "";
  }

  function currentDriverMeta() {
    return DRIVERS[step - 1];
  }

  function currentQuestions() {
    return DRIVER_QUESTIONS[currentDriverId()]?.questions ?? [];
  }

  function isCurrentStepComplete() {
    if (step === 0) return true;
    const dId = currentDriverId();
    const qs = currentQuestions();
    return qs.every((_, i) => getAnswer(dId, i) !== undefined);
  }

  async function handleSubmit() {
    if (!meta) return;
    setSubmitting(true);
    try {
      const { fpScores, driverScores, layerScores, gapScores } = computeFullScores(answers);

      const payload = {
        batch_id: meta.batch_id,
        division_id: divisionId || null,
        raw_answers: answers,
        open_ended: openEnded,
        fp_scores: fpScores,
        driver_scores: driverScores,
        layer_scores: layerScores,
        gap_scores: gapScores,
        response_status: "complete",
      };

      const { error: insertErr } = await supabase
        .from("survey_responses")
        .insert(payload);

      if (insertErr) throw insertErr;
      setSubmitted(true);
      setStep(DRIVERS.length + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan jawaban. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !meta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-destructive/10">
          <Building2 className="size-8 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Survey Tidak Tersedia</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-green-500/10">
          <CheckCircle2 className="size-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Terima kasih!</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Jawaban Anda telah berhasil dikirim. Hasil assessment akan diproses secara aggregate dan
          anonim oleh tim ANSAKA.
        </p>
      </div>
    );
  }

  const totalSteps = DRIVERS.length;
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100);
  const driverData = step > 0 ? currentDriverMeta() : null;
  const questions = step > 0 ? currentQuestions() : [];
  const dId = step > 0 ? currentDriverId() : "";
  const openEndedQ = step > 0 ? DRIVER_QUESTIONS[dId]?.openEnded : "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-full bg-primary">
              <Building2 className="size-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">ANSAKA OAM Insight</p>
              <p className="text-xs text-muted-foreground">{meta?.batch_name}</p>
            </div>
          </div>
          {step > 0 && (
            <p className="text-sm text-muted-foreground">
              Driver {step} / {totalSteps}
            </p>
          )}
        </div>
        {step > 0 && (
          <div className="mx-auto max-w-3xl px-4 pb-3">
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </header>

      <div
        ref={contentRef}
        tabIndex={-1}
        className="mx-auto max-w-3xl px-4 py-10 outline-none"
      >
        {/* Intro step */}
        {step === 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Organizational Assessment Map
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Survey Diagnostik Organisasi
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Anda akan menjawab <strong className="text-foreground">pertanyaan seputar kondisi organisasi</strong> dari
              perspektif Anda sehari-hari. Tidak ada jawaban benar atau salah — yang dibutuhkan adalah
              penilaian jujur berdasarkan pengalaman nyata Anda.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "12 Driver", sub: "Area utama yang diukur" },
                { label: "~15 menit", sub: "Estimasi waktu pengisian" },
                { label: "Anonim", sub: "Jawaban tidak bisa dilacak ke individu" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.25rem] border border-border bg-card p-5">
                  <p className="text-xl font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.25rem] border border-border bg-card/50 p-6">
              <p className="text-sm font-medium">Skala penilaian:</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {SCALE.map((s) => (
                  <div key={s.value} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-xs font-mono">
                      {s.value}
                    </span>
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Division selector */}
            {meta && meta.divisions.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium">
                  Divisi / Unit Kerja <span className="text-muted-foreground">(opsional)</span>
                </label>
                <Select value={divisionId} onValueChange={setDivisionId}>
                  <SelectTrigger className="mt-2 w-full max-w-sm">
                    <SelectValue placeholder="Pilih divisi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {meta.divisions.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button className="mt-10 h-12 px-8" onClick={() => setStep(1)}>
              Mulai Survey
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        {/* Driver steps */}
        {step > 0 && step <= totalSteps && driverData && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Driver {step} — {driverData.layer.replace(/_/g, " ")}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{driverData.name}</h2>

            <div className="mt-8 space-y-6">
              {questions.map((q, i) => {
                const val = getAnswer(dId, i);
                return (
                  <div key={i} className="rounded-[1.25rem] border border-border bg-card p-6">
                    <p className="text-sm font-medium leading-6 text-foreground">
                      <span className="font-mono text-xs text-muted-foreground">Q{i + 1}&nbsp;&nbsp;</span>
                      {q}
                    </p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                      {SCALE.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setAnswer(dId, i, s.value)}
                          className={[
                            "rounded-[0.875rem] border px-3 py-2.5 text-left text-xs font-medium transition-all",
                            val === s.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border/70 bg-background text-muted-foreground hover:border-primary/50 hover:bg-muted",
                          ].join(" ")}
                        >
                          <span className="block font-mono text-lg font-bold">{s.value}</span>
                          <span className="mt-0.5 block leading-4">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Open-ended */}
              {openEndedQ && (
                <div className="rounded-[1.25rem] border border-border bg-card p-6">
                  <p className="text-sm font-medium leading-6 text-foreground">
                    <span className="font-mono text-xs text-muted-foreground">Open&nbsp;&nbsp;</span>
                    {openEndedQ}
                  </p>
                  <Textarea
                    className="mt-4 min-h-[100px]"
                    placeholder="Tuliskan pengalaman atau contoh nyata Anda di sini... (opsional)"
                    value={openEnded[dId] ?? ""}
                    onChange={(e) =>
                      setOpenEnded((prev) => ({ ...prev, [dId]: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 rounded-[1rem] border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
              >
                <ChevronLeft className="size-4" />
                Sebelumnya
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!isCurrentStepComplete()}
                >
                  Selanjutnya
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isCurrentStepComplete() || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Kirim Jawaban
                      <CheckCircle2 className="size-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
