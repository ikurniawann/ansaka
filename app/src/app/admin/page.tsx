"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, BarChart3, Building2, CreditCard, Loader2,
  ReceiptText, ShieldCheck, Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
};

type BatchRow = {
  id: string;
  organization_id: string;
  status: string;
  credits_allocated: number;
  credits_used: number;
  created_at: string;
};

type BatchResultRow = {
  batch_id: string;
  respondent_count: number;
  overall_score: number | null;
};

type CreditPackageRow = {
  id: string;
  name: string;
  price_idr: number;
};

type TransactionRow = {
  id: string;
  organization_id: string | null;
  user_id: string | null;
  type: string;
  amount: number;
  package_id: string | null;
  payment_provider: string | null;
  payment_status: string;
  external_id: string | null;
  created_at: string;
  paid_at: string | null;
};

type WorkspaceSummary = {
  id: string;
  name: string;
  industry: string | null;
  admins: number;
  creditBalance: number;
  batches: number;
  activeBatches: number;
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

function statusBadge(status: string) {
  if (status === "paid" || status === "completed") return <Badge variant="success">Paid</Badge>;
  if (status === "pending") return <Badge variant="warning">Pending</Badge>;
  if (status === "failed") return <Badge variant="danger">Failed</Badge>;
  if (status === "expired") return <Badge variant="muted">Expired</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default function AdminOverviewPage() {
  const [organizations, setOrganizations] = useState<OrganizationRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [results, setResults] = useState<BatchResultRow[]>([]);
  const [packages, setPackages] = useState<CreditPackageRow[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [orgRes, userRes, batchRes, resultRes, packageRes, txRes] = await Promise.all([
        supabase
          .from("organizations")
          .select("id, name, industry, size_range, country, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("users")
          .select("id, organization_id, role, credit_balance"),
        supabase
          .from("survey_batches")
          .select("id, organization_id, status, credits_allocated, credits_used, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("batch_results")
          .select("batch_id, respondent_count, overall_score"),
        supabase
          .from("credit_packages")
          .select("id, name, price_idr"),
        supabase
          .from("credit_transactions")
          .select("id, organization_id, user_id, type, amount, package_id, payment_provider, payment_status, external_id, created_at, paid_at")
          .order("created_at", { ascending: false })
          .limit(100),
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

  const packagePriceById = useMemo(
    () => new Map(packages.map((pkg) => [pkg.id, pkg.price_idr])),
    [packages],
  );

  const batchOrgById = useMemo(
    () => new Map(batches.map((batch) => [batch.id, batch.organization_id])),
    [batches],
  );

  const workspaceSummaries = useMemo<WorkspaceSummary[]>(() => {
    const summary = new Map<string, WorkspaceSummary>();

    organizations.forEach((org) => {
      summary.set(org.id, {
        id: org.id,
        name: org.name,
        industry: org.industry,
        admins: 0,
        creditBalance: 0,
        batches: 0,
        activeBatches: 0,
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
      if (batch.status === "active") item.activeBatches += 1;
    });

    results.forEach((result) => {
      const orgId = batchOrgById.get(result.batch_id);
      if (!orgId) return;
      const item = summary.get(orgId);
      if (item) item.responses += result.respondent_count ?? 0;
    });

    transactions.forEach((tx) => {
      if (tx.type !== "purchase" || !tx.organization_id) return;
      if (tx.payment_status !== "paid" && tx.payment_status !== "completed") return;
      const item = summary.get(tx.organization_id);
      if (!item) return;
      item.revenue += tx.package_id ? packagePriceById.get(tx.package_id) ?? 0 : 0;
    });

    return [...summary.values()].sort((a, b) => b.revenue - a.revenue || b.responses - a.responses);
  }, [batchOrgById, batches, organizations, packagePriceById, results, transactions, users]);

  const stats = useMemo(() => {
    const paidTransactions = transactions.filter(
      (tx) => tx.type === "purchase" && (tx.payment_status === "paid" || tx.payment_status === "completed"),
    );
    const pendingTransactions = transactions.filter(
      (tx) => tx.type === "purchase" && tx.payment_status === "pending",
    );

    return {
      totalOrgs: organizations.length,
      totalUsers: users.length,
      superAdmins: users.filter((user) => user.role === "super_admin").length,
      activeBatches: batches.filter((batch) => batch.status === "active").length,
      totalBatches: batches.length,
      totalResponses: results.reduce((sum, result) => sum + (result.respondent_count ?? 0), 0),
      creditsSold: paidTransactions.reduce((sum, tx) => sum + Math.max(tx.amount, 0), 0),
      paidRevenue: paidTransactions.reduce(
        (sum, tx) => sum + (tx.package_id ? packagePriceById.get(tx.package_id) ?? 0 : 0),
        0,
      ),
      pendingRevenue: pendingTransactions.reduce(
        (sum, tx) => sum + (tx.package_id ? packagePriceById.get(tx.package_id) ?? 0 : 0),
        0,
      ),
    };
  }, [batches, organizations.length, packagePriceById, results, transactions, users]);

  const orgNameById = useMemo(
    () => new Map(organizations.map((org) => [org.id, org.name])),
    [organizations],
  );

  const latestPayments = transactions
    .filter((tx) => tx.type === "purchase")
    .slice(0, 6);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cards = [
    { label: "Client Workspace", value: stats.totalOrgs.toLocaleString("id-ID"), icon: Building2 },
    { label: "Platform Users", value: stats.totalUsers.toLocaleString("id-ID"), icon: Users },
    { label: "Revenue Paid", value: formatRupiah(stats.paidRevenue), icon: ReceiptText },
    { label: "Credits Sold", value: stats.creditsSold.toLocaleString("id-ID"), icon: CreditCard },
  ];

  return (
    <div className="px-8 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Super Admin Platform</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">ANSAKA Control Center</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Pantau client, transaksi Xendit, penggunaan kredit, dan aktivitas assessment dari satu cockpit.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/organizations">
            Kelola Client
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="size-4" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BarChart3 className="size-4" />
              Assessment Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-2xl font-bold">{stats.totalBatches}</p>
              <p className="text-xs text-muted-foreground">batch</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.activeBatches}</p>
              <p className="text-xs text-muted-foreground">aktif</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalResponses}</p>
              <p className="text-xs text-muted-foreground">respons</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ReceiptText className="size-4" />
              Payment Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-2xl font-bold">{formatRupiah(stats.pendingRevenue)}</p>
              <p className="text-xs text-muted-foreground">pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{latestPayments.length}</p>
              <p className="text-xs text-muted-foreground">latest invoices</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="size-4" />
              Platform Access
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-2xl font-bold">{stats.superAdmins}</p>
              <p className="text-xs text-muted-foreground">super admin</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalUsers - stats.superAdmins}</p>
              <p className="text-xs text-muted-foreground">corporate admin</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Top Client Workspaces</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Diurutkan dari revenue dan aktivitas respons tertinggi.</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/admin/organizations">Lihat semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Admins</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Respons</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaceSummaries.slice(0, 6).map((workspace) => (
                  <TableRow key={workspace.id}>
                    <TableCell>
                      <p className="font-medium">{workspace.name}</p>
                      <p className="text-xs text-muted-foreground">{workspace.industry ?? "Industry belum diisi"}</p>
                    </TableCell>
                    <TableCell>{workspace.admins}</TableCell>
                    <TableCell>
                      <span className="font-medium">{workspace.batches}</span>
                      <span className="ml-1 text-xs text-muted-foreground">({workspace.activeBatches} aktif)</span>
                    </TableCell>
                    <TableCell>{workspace.responses.toLocaleString("id-ID")}</TableCell>
                    <TableCell>{formatRupiah(workspace.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Latest Payments</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Invoice Xendit terbaru dari corporate client.</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/admin/transactions">Detail</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada transaksi purchase.</p>
            ) : (
              latestPayments.map((tx) => (
                <div key={tx.id} className="rounded-[1rem] border border-border bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{tx.organization_id ? orgNameById.get(tx.organization_id) ?? "-" : "-"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {tx.amount.toLocaleString("id-ID")} credits · {tx.payment_provider ?? "manual"}
                      </p>
                    </div>
                    {statusBadge(tx.payment_status)}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
