"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase-client";

type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  price_idr: number;
  description: string | null;
  sort_order: number;
};

type CreditTx = {
  id: string;
  type: string;
  amount: number;
  notes: string | null;
  payment_provider: string | null;
  payment_status: string;
  checkout_url: string | null;
  created_at: string;
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function CreditsPage() {
  const router = useRouter();
  const [creditBalance, setCreditBalance] = useState(0);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [transactions, setTransactions] = useState<CreditTx[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutPackageId, setCheckoutPackageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPollingPayment, setIsPollingPayment] = useState(false);

  async function loadCreditData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace("/login"); return null; }

    const { data: profile } = await supabase
      .from("users")
      .select("organization_id, credit_balance")
      .eq("id", session.user.id)
      .single();

    if (!profile) return null;

    setCreditBalance(profile.credit_balance ?? 0);
    setOrgId(profile.organization_id);

    const [pkgRes, txRes] = await Promise.all([
      supabase
        .from("credit_packages")
        .select("id, name, credits, price_idr, description, sort_order")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("credit_transactions")
        .select("id, type, amount, notes, payment_provider, payment_status, checkout_url, created_at")
        .eq("organization_id", profile.organization_id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    setPackages((pkgRes.data ?? []) as CreditPackage[]);
    setTransactions((txRes.data ?? []) as CreditTx[]);

    return {
      profile,
      transactions: (txRes.data ?? []) as CreditTx[],
    };
  }

  useEffect(() => {
    let interval: number | undefined;
    let cancelled = false;

    (async () => {
      const paymentResult = new URLSearchParams(window.location.search).get("payment");
      if (paymentResult === "success") {
        setNotice("Pembayaran sedang diverifikasi. Saldo akan bertambah otomatis setelah callback Xendit masuk.");
      }
      if (paymentResult === "failed") {
        setError("Pembayaran dibatalkan atau gagal. Silakan coba lagi.");
      }

      const initialData = await loadCreditData();
      if (cancelled) return;
      setLoading(false);

      if (paymentResult !== "success" || !initialData) return;

      const latestPurchase = initialData.transactions.find(
        (tx) => tx.type === "purchase" && tx.payment_provider === "xendit",
      );

      if (latestPurchase?.payment_status === "paid") {
        setNotice("Pembayaran berhasil. Kredit sudah masuk ke saldo workspace.");
        return;
      }

      setIsPollingPayment(true);

      let attempts = 0;
      interval = window.setInterval(async () => {
        attempts += 1;
        const nextData = await loadCreditData();
        if (cancelled) return;
        const latest = nextData?.transactions.find(
          (tx) => tx.type === "purchase" && tx.payment_provider === "xendit",
        );

        if (latest?.payment_status === "paid") {
          setNotice("Pembayaran berhasil. Kredit sudah masuk ke saldo workspace.");
          setIsPollingPayment(false);
          window.clearInterval(interval);
        }

        if (attempts >= 12) {
          setIsPollingPayment(false);
          window.clearInterval(interval);
        }
      }, 2500);
    })();

    return () => {
      cancelled = true;
      if (interval) window.clearInterval(interval);
    };
  }, [router]);

  function txTypeBadge(type: string, amount: number) {
    if (type === "purchase" || type === "adjust" && amount > 0)
      return <Badge variant="success">+{amount}</Badge>;
    if (type === "allocate" || type === "consume")
      return <Badge variant="danger">{amount}</Badge>;
    return <Badge variant="outline">{amount > 0 ? "+" : ""}{amount}</Badge>;
  }

  function paymentStatusBadge(status: string) {
    if (status === "paid" || status === "completed") return <Badge variant="success">Paid</Badge>;
    if (status === "pending") return <Badge variant="warning">Pending</Badge>;
    if (status === "expired") return <Badge variant="muted">Expired</Badge>;
    if (status === "failed") return <Badge variant="danger">Failed</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  }

  async function startXenditCheckout(packageId: string) {
    setError(null);
    setNotice(null);
    setCheckoutPackageId(packageId);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const response = await fetch("/api/payments/xendit/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ packageId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Gagal membuat invoice Xendit.");
      }

      window.location.href = result.invoiceUrl;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Terjadi kesalahan.");
      setCheckoutPackageId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Manajemen Kredit</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Kredit & Paket</h1>

      {notice ? (
        <Alert className="mt-4 max-w-3xl" variant="success">
          <AlertDescription className="flex items-center gap-2">
            {isPollingPayment ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {notice}
          </AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert className="mt-4 max-w-3xl" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {/* Balance */}
      <div data-tour="credits-balance" className="mt-6 flex items-center gap-4 rounded-[1.5rem] border border-border bg-card p-6">
        <div className="grid size-12 place-items-center rounded-full bg-primary">
          <CreditCard className="size-6 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Saldo Kredit Anda</p>
          <p className="text-3xl font-bold">{creditBalance}</p>
          <p className="text-xs text-muted-foreground">
            1 kredit = 1 responden survey yang diselesaikan
          </p>
        </div>
      </div>

      {/* Packages */}
      <div data-tour="credits-packages" className="mt-8">
        <h2 className="text-base font-semibold">Paket Kredit Tersedia</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pembayaran sandbox memakai Xendit development mode. Tidak ada tagihan real selama
          kredensial Xendit masih development.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="relative overflow-hidden">
              {pkg.sort_order === 3 && (
                <div className="absolute right-3 top-3">
                  <Badge variant="default" className="text-xs">Populer</Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{pkg.name}</CardTitle>
                {pkg.description && (
                  <p className="text-xs text-muted-foreground">{pkg.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{pkg.credits.toLocaleString("id-ID")}</p>
                <p className="text-sm text-muted-foreground">kredit</p>
                <p className="mt-3 text-lg font-semibold">{formatRupiah(pkg.price_idr)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatRupiah(Math.round(pkg.price_idr / pkg.credits))}/kredit
                </p>
                <Button
                  variant="default"
                  className="mt-4 w-full"
                  disabled={checkoutPackageId === pkg.id}
                  onClick={() => startXenditCheckout(pkg.id)}
                >
                  {checkoutPackageId === pkg.id ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Membuat invoice...
                    </>
                  ) : (
                    "Beli Sekarang"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div data-tour="credits-transactions" className="mt-10">
        <h2 className="text-base font-semibold">Riwayat Transaksi</h2>
        {transactions.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Belum ada transaksi kredit.</p>
        ) : (
          <div className="mt-4 rounded-[1.5rem] border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-sm">{tx.type}</span>
                    </TableCell>
                    <TableCell>{txTypeBadge(tx.type, tx.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {paymentStatusBadge(tx.payment_status)}
                        {tx.checkout_url && tx.payment_status === "pending" ? (
                          <a
                            className="text-xs font-medium underline underline-offset-2"
                            href={tx.checkout_url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Bayar
                          </a>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {tx.notes ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
