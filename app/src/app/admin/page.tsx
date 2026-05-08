"use client";

import { useEffect, useState } from "react";
import { BarChart3, Building2, CreditCard, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase-client";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalOrgs: 0,
    totalUsers: 0,
    totalBatches: 0,
    totalResponses: 0,
  });

  useEffect(() => {
    (async () => {
      const [orgs, users, batches, results] = await Promise.all([
        supabase.from("organizations").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("survey_batches").select("id", { count: "exact", head: true }),
        supabase.from("batch_results").select("respondent_count"),
      ]);
      setStats({
        totalOrgs: orgs.count ?? 0,
        totalUsers: users.count ?? 0,
        totalBatches: batches.count ?? 0,
        totalResponses: (results.data ?? []).reduce((s: number, r: { respondent_count: number }) => s + (r.respondent_count ?? 0), 0),
      });
    })();
  }, []);

  const cards = [
    { label: "Organisasi",    value: stats.totalOrgs,      icon: Building2  },
    { label: "Users",         value: stats.totalUsers,     icon: Users      },
    { label: "Batch Survey",  value: stats.totalBatches,   icon: BarChart3  },
    { label: "Total Respons", value: stats.totalResponses, icon: CreditCard },
  ];

  return (
    <div className="px-8 py-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Super Admin</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Admin Overview</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="size-4" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value.toLocaleString("id-ID")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
