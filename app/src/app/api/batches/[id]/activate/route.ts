import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type Batch = {
  id: string;
  organization_id: string;
  status: "draft" | "active" | "closed";
  credits_allocated: number;
};

type Profile = {
  id: string;
  organization_id: string | null;
  role: "corporate_admin" | "super_admin";
  credit_balance: number;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return jsonError("Sesi tidak ditemukan. Login ulang lalu coba lagi.", 401);
    }

    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );

    const {
      data: { user },
      error: userError,
    } = await userSupabase.auth.getUser(token);

    if (userError || !user) {
      return jsonError("Sesi tidak valid. Login ulang lalu coba lagi.", 401);
    }

    const [{ data: profile, error: profileError }, { data: batch, error: batchError }] =
      await Promise.all([
        supabaseAdmin
          .from("users")
          .select("id, organization_id, role, credit_balance")
          .eq("id", user.id)
          .single<Profile>(),
        supabaseAdmin
          .from("survey_batches")
          .select("id, organization_id, status, credits_allocated")
          .eq("id", id)
          .single<Batch>(),
      ]);

    if (profileError || !profile) {
      return jsonError("Profil pengguna tidak ditemukan.", 404);
    }

    if (batchError || !batch) {
      return jsonError("Batch tidak ditemukan.", 404);
    }

    const hasAccess =
      profile.role === "super_admin" || profile.organization_id === batch.organization_id;

    if (!hasAccess) {
      return jsonError("Anda tidak memiliki akses ke batch ini.", 403);
    }

    if (batch.status === "active") {
      return NextResponse.json({ batch });
    }

    if (batch.status !== "draft") {
      return jsonError("Batch hanya bisa diaktifkan dari status Draft.");
    }

    if (batch.credits_allocated <= 0) {
      return jsonError("Alokasikan kredit terlebih dahulu sebelum mengaktifkan batch.");
    }

    if (profile.role !== "corporate_admin" || profile.organization_id !== batch.organization_id) {
      return jsonError("Aktivasi batch harus dilakukan oleh admin corporate pemilik workspace.", 403);
    }

    if (profile.credit_balance < batch.credits_allocated) {
      return jsonError("Saldo kredit tidak mencukupi. Top up kredit lalu coba lagi.");
    }

    const nextBalance = profile.credit_balance - batch.credits_allocated;

    const { error: creditError } = await supabaseAdmin
      .from("users")
      .update({ credit_balance: nextBalance, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .eq("credit_balance", profile.credit_balance);

    if (creditError) {
      throw creditError;
    }

    const { data: activatedBatch, error: batchUpdateError } = await supabaseAdmin
      .from("survey_batches")
      .update({ status: "active" })
      .eq("id", batch.id)
      .eq("status", "draft")
      .select("id, organization_id, status, credits_allocated")
      .single<Batch>();

    if (batchUpdateError || !activatedBatch) {
      await supabaseAdmin
        .from("users")
        .update({ credit_balance: profile.credit_balance, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      throw batchUpdateError ?? new Error("Gagal mengaktifkan batch.");
    }

    const { error: transactionError } = await supabaseAdmin.from("credit_transactions").insert({
      organization_id: batch.organization_id,
      user_id: user.id,
      type: "allocate",
      amount: -batch.credits_allocated,
      batch_id: batch.id,
      notes: "Credit allocated for batch activation",
    });

    if (transactionError) {
      // Activation should not fail only because audit logging failed.
      console.error("Failed to write batch activation credit transaction", transactionError);
    }

    return NextResponse.json({ batch: activatedBatch, creditBalance: nextBalance });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengaktifkan batch.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
