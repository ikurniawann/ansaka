"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Loader2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase-client";

type OrganizationRow = {
  id: string;
  name: string;
};

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
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
  checkout_url: string | null;
  created_at: string;
  paid_at: string | null;
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

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [packages, setPackages] = useState<CreditPackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const [txRes, orgRes, userRes, packageRes] = await Promise.all([
        supabase
          .from("credit_transactions")
          .select("id, organization_id, user_id, type, amount, package_id, payment_provider, payment_status, external_id, checkout_url, created_at, paid_at")
          .order("created_at", { ascending: false })
          .limit(200),
        supabase.from("organizations").select("id, name"),
        supabase.from("users").select("id, email, full_name"),
        supabase.from("credit_packages").select("id, name, price_idr"),
      ]);

      setTransactions((txRes.data ?? []) as TransactionRow[]);
      setOrganizations((orgRes.data ?? []) as OrganizationRow[]);
      setUsers((userRes.data ?? []) as UserRow[]);
      setPackages((packageRes.data ?? []) as CreditPackageRow[]);
      setLoading(false);
    })();
  }, []);

  const orgNameById = useMemo(
    () => new Map(organizations.map((org) => [org.id, org.name])),
    [organizations],
  );
  const userById = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );
  const packageById = useMemo(
    () => new Map(packages.map((pkg) => [pkg.id, pkg])),
    [packages],
  );

  const purchaseTransactions = transactions.filter((tx) => tx.type === "purchase");
  const paidTransactions = purchaseTransactions.filter((tx) => tx.payment_status === "paid" || tx.payment_status === "completed");
  const pendingTransactions = purchaseTransactions.filter((tx) => tx.payment_status === "pending");

  const filtered = transactions.filter((tx) => {
    if (statusFilter !== "all" && tx.payment_status !== statusFilter) return false;

    const orgName = tx.organization_id ? orgNameById.get(tx.organization_id) ?? "" : "";
    const user = tx.user_id ? userById.get(tx.user_id) : null;
    const pkg = tx.package_id ? packageById.get(tx.package_id) : null;
    const haystack = [
      orgName,
      user?.email,
      user?.full_name,
      pkg?.name,
      tx.type,
      tx.payment_provider,
      tx.external_id,
    ].join(" ").toLowerCase();

    return haystack.includes(search.toLowerCase());
  });

  const estimatedPaidRevenue = paidTransactions.reduce((sum, tx) => {
    if (!tx.package_id) return sum;
    return sum + (packageById.get(tx.package_id)?.price_idr ?? 0);
  }, 0);

  const estimatedPendingRevenue = pendingTransactions.reduce((sum, tx) => {
    if (!tx.package_id) return sum;
    return sum + (packageById.get(tx.package_id)?.price_idr ?? 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Super Admin</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Transactions & Payments</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Audit pembelian kredit, status invoice Xendit, dan transaksi pemakaian kredit semua client.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatRupiah(estimatedPaidRevenue)}</p>
              <p className="text-xs text-muted-foreground">paid purchase revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{formatRupiah(estimatedPendingRevenue)}</p>
            <p className="text-xs text-muted-foreground">pending purchase pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">
              {paidTransactions.reduce((sum, tx) => sum + Math.max(tx.amount, 0), 0).toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-muted-foreground">credits sold</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari client, invoice, user..."
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Paket / Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ref</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tx) => {
                const user = tx.user_id ? userById.get(tx.user_id) : null;
                const pkg = tx.package_id ? packageById.get(tx.package_id) : null;
                return (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">
                        {tx.organization_id ? orgNameById.get(tx.organization_id) ?? "-" : "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.payment_provider ?? "manual"}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{user?.full_name ?? "-"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email ?? "-"}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.type === "purchase" ? "default" : "outline"}>{tx.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">
                        {pkg ? pkg.name : `${tx.amount > 0 ? "+" : ""}${tx.amount} credits`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pkg ? `${formatRupiah(pkg.price_idr)} · ${tx.amount} credits` : "manual movement"}
                      </p>
                    </TableCell>
                    <TableCell>{statusBadge(tx.payment_status)}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">
                      {tx.checkout_url ? (
                        <a href={tx.checkout_url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                          {tx.external_id ?? tx.id}
                        </a>
                      ) : (
                        tx.external_id ?? tx.id
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
