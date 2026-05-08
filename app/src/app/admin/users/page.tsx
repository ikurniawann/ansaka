"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase-client";

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  credit_balance: number;
  created_at: string;
  organizations: { name: string }[] | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState(0);
  const [editRole, setEditRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadUsers() {
    const { data } = await supabase
      .from("users")
      .select("id, email, full_name, role, credit_balance, created_at, organizations(name)")
      .order("created_at", { ascending: false });
    setUsers((data ?? []) as UserRow[]);
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  async function saveEdit(userId: string) {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from("users")
      .update({ credit_balance: editBalance, role: editRole })
      .eq("id", userId);
    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Tersimpan.");
      await loadUsers();
      setEditId(null);
    }
    setSaving(false);
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.full_name ?? "").toLowerCase().includes(q) ||
      (u.organizations?.[0]?.name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="px-8 py-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">User Management</h1>

      <div className="mt-6">
        <Input
          placeholder="Cari email, nama, atau organisasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {message && (
        <Alert className="mt-4" variant={message.startsWith("Error") ? "destructive" : "success"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-6 rounded-[1.5rem] border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Organisasi</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Kredit</TableHead>
                <TableHead>Bergabung</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{user.full_name ?? "-"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </TableCell>
                  <TableCell className="text-sm">{user.organizations?.[0]?.name ?? "-"}</TableCell>
                  <TableCell>
                    {editId === user.id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="rounded-[0.5rem] border border-border bg-background px-2 py-1 text-sm"
                      >
                        <option value="corporate_admin">corporate_admin</option>
                        <option value="super_admin">super_admin</option>
                      </select>
                    ) : (
                      <Badge variant={user.role === "super_admin" ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === user.id ? (
                      <Input
                        type="number"
                        value={editBalance}
                        onChange={(e) => setEditBalance(Number(e.target.value))}
                        className="w-24 h-8 text-sm"
                      />
                    ) : (
                      <span className="text-sm font-medium">{user.credit_balance}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {editId === user.id ? (
                      <div className="flex gap-2">
                        <Button size="default" onClick={() => saveEdit(user.id)} disabled={saving}>
                          {saving ? <Loader2 className="size-3 animate-spin" /> : "Simpan"}
                        </Button>
                        <Button size="default" variant="ghost" onClick={() => setEditId(null)}>
                          Batal
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="default"
                        variant="ghost"
                        onClick={() => {
                          setEditId(user.id);
                          setEditBalance(user.credit_balance);
                          setEditRole(user.role);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
