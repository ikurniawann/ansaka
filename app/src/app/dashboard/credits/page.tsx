"use client";

import { useRouter } from "next/navigation";
import { CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const { data: profile } = await supabase
        .from("users")
        .select("organization_id, credit_balance")
        .eq("id", session.user.id)
        .single();

      if (!profile) { setLoading(false); return; }
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
          .select("id, type, amount, notes, created_at")
          .eq("organization_id", profile.organization_id)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      setPackages((pkgRes.data ?? []) as CreditPackage[]);
      setTransactions((txRes.data ?? []) as CreditTx[]);
      setLoading(false);
    })();
  }, [router]);

  function txTypeBadge(type: string, amount: number) {
    if (type === "purchase" || type === "adjust" && amount > 0)
      return <Badge variant="success">+{amount}</Badge>;
    if (type === "allocate" || type === "consume")
      return <Badge variant="danger">{amount}</Badge>;
    return <Badge variant="outline">{amount > 0 ? "+" : ""}{amount}</Badge>;
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

      {/* Balance */}
      <div className="mt-6 flex items-center gap-4 rounded-[1.5rem] border border-border bg-card p-6">
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
      <div className="mt-8">
        <h2 className="text-base font-semibold">Paket Kredit Tersedia</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Untuk pembelian kredit, hubungi tim ANSAKA di{" "}
          <a href="mailto:hello@ansaka.id" className="font-medium underline underline-offset-2">
            hello@ansaka.id
          </a>
          . Tim kami akan memproses dan menambahkan kredit ke akun Anda.
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
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => window.open("mailto:hello@ansaka.id?subject=Pembelian Kredit " + pkg.name, "_blank")}
                >
                  Hubungi Kami
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="mt-10">
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
