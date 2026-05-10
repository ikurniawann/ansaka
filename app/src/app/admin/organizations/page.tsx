"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Building2, Loader2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase-client";

type OrganizationRow = {
  id: string;
  name: string;
  industry: string | null;
  size_range: string | null;
  country: string | null;
  created_at: string;
};

type UserRow = {
  id: string;
  organization_id: string | null;
  role: string;
  credit_balance: number;
  email: string | null;
};

type BatchRow = {
  id: string;
  organization_id: string;
  status: string;
  credits_allocated: number;
  credits_used: number;
};

type BatchResultRow = {
  batch_id: string;
  respondent_count: number;
};

type CreditPackageRow = {
  id: string;
  price_idr: number;
};

type TransactionRow = {
  organization_id: string | null;
  type: string;
  package_id: string | null;
  payment_status: string;
};

type OrganizationSummary = OrganizationRow & {
  admins: number;
  creditBalance: number;
  batches: number;
  activeBatches: number;
  creditsUsed: number;
  creditsAllocated: number;
  responses: number;
  revenue: number;
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [results, setResults] = useState<BatchResultRow[]>([]);
  const [packages, setPackages] = useState<CreditPackageRow[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const [orgRes, userRes, batchRes, resultRes, packageRes, txRes] = await Promise.all([
        supabase
          .from("organizations")
          .select("id, name, industry, size_range, country, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("users")
          .select("id, organization_id, role, credit_balance, email"),
        supabase
          .from("survey_batches")
          .select("id, organization_id, status, credits_allocated, credits_used"),
        supabase
          .from("batch_results")
          .select("batch_id, respondent_count"),
        supabase
          .from("credit_packages")
          .select("id, price_idr"),
        supabase
          .from("credit_transactions")
          .select("organization_id, type, package_id, payment_status")
          .eq("type", "purchase"),
      ]);

      setOrganizations((orgRes.data ?? []) as OrganizationRow[]);
      setUsers((userRes.data ?? []) as UserRow[]);
      setBatches((batchRes.data ?? []) as BatchRow[]);
      setResults((resultRes.data ?? []) as BatchResultRow[]);
      setPackages((packageRes.data ?? []) as CreditPackageRow[]);
      setTransactions((txRes.data ?? []) as TransactionRow[]);
      setLoading(false);
    })();
  }, []);

  const summaries = useMemo<OrganizationSummary[]>(() => {
    const packagePriceById = new Map(packages.map((pkg) => [pkg.id, pkg.price_idr]));
    const batchOrgById = new Map(batches.map((batch) => [batch.id, batch.organization_id]));
    const summary = new Map<string, OrganizationSummary>();

    organizations.forEach((org) => {
      summary.set(org.id, {
        ...org,
        admins: 0,
        creditBalance: 0,
        batches: 0,
        activeBatches: 0,
        creditsUsed: 0,
        creditsAllocated: 0,
        responses: 0,
        revenue: 0,
      });
    });

    users.forEach((user) => {
      if (!user.organization_id) return;
      const item = summary.get(user.organization_id);
      if (!item) return;
      if (user.role === "corporate_admin") item.admins += 1;
      item.creditBalance += user.credit_balance ?? 0;
    });

    batches.forEach((batch) => {
      const item = summary.get(batch.organization_id);
      if (!item) return;
      item.batches += 1;
      item.creditsAllocated += batch.credits_allocated ?? 0;
      item.creditsUsed += batch.credits_used ?? 0;
      if (batch.status === "active") item.activeBatches += 1;
    });

    results.forEach((result) => {
      const orgId = batchOrgById.get(result.batch_id);
      if (!orgId) return;
      const item = summary.get(orgId);
      if (item) item.responses += result.respondent_count ?? 0;
    });

    transactions.forEach((tx) => {
      if (!tx.organization_id) return;
      if (tx.payment_status !== "paid" && tx.payment_status !== "completed") return;
      const item = summary.get(tx.organization_id);
      if (item && tx.package_id) item.revenue += packagePriceById.get(tx.package_id) ?? 0;
    });

    return [...summary.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [batches, organizations, packages, results, transactions, users]);

  const filtered = summaries.filter((org) => {
    const q = search.toLowerCase();
    return (
      org.name.toLowerCase().includes(q) ||
      (org.industry ?? "").toLowerCase().includes(q) ||
      (org.country ?? "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Super Admin</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Client Organizations</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Lihat tenant corporate, saldo kredit, aktivitas batch, respons, dan estimasi revenue.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/users">Kelola user</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summaries.length}</p>
              <p className="text-xs text-muted-foreground">total organizations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{summaries.reduce((sum, org) => sum + org.creditBalance, 0).toLocaleString("id-ID")}</p>
            <p className="text-xs text-muted-foreground">credits currently held</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{formatRupiah(summaries.reduce((sum, org) => sum + org.revenue, 0))}</p>
            <p className="text-xs text-muted-foreground">estimated paid revenue</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Workspace Registry</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari organisasi..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Admins</TableHead>
                <TableHead>Kredit</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Respons</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Bergabung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[org.industry, org.size_range, org.country].filter(Boolean).join(" · ") || "Profil belum lengkap"}
                    </p>
                  </TableCell>
                  <TableCell>{org.admins}</TableCell>
                  <TableCell>
                    <p className="font-medium">{org.creditBalance.toLocaleString("id-ID")}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.creditsUsed} / {org.creditsAllocated} used
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={org.activeBatches > 0 ? "success" : "muted"}>
                      {org.activeBatches} aktif
                    </Badge>
                    <span className="ml-2 text-sm text-muted-foreground">{org.batches} total</span>
                  </TableCell>
                  <TableCell>{org.responses.toLocaleString("id-ID")}</TableCell>
                  <TableCell>{formatRupiah(org.revenue)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(org.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
