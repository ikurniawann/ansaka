import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type XenditInvoiceWebhook = {
  id?: string;
  external_id?: string;
  status?: string;
  paid_at?: string;
  metadata?: {
    transaction_id?: string;
    organization_id?: string;
    credits?: number;
  };
};

function normalizeStatus(status?: string) {
  const upper = status?.toUpperCase();
  if (upper === "PAID" || upper === "SETTLED") return "paid";
  if (upper === "EXPIRED") return "expired";
  if (upper === "FAILED") return "failed";
  return "pending";
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;
  const callbackToken = request.headers.get("x-callback-token");

  if (expectedToken && callbackToken !== expectedToken) {
    return NextResponse.json({ error: "Invalid callback token." }, { status: 401 });
  }

  const payload = (await request.json()) as XenditInvoiceWebhook;
  const externalId = payload.external_id;

  if (!externalId) {
    return NextResponse.json({ error: "Missing external_id." }, { status: 400 });
  }

  const { data: transaction, error: transactionError } = await supabaseAdmin
    .from("credit_transactions")
    .select("id, organization_id, user_id, amount, payment_status")
    .eq("external_id", externalId)
    .single();

  if (transactionError || !transaction) {
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  }

  const nextStatus = normalizeStatus(payload.status);

  if (transaction.payment_status === "paid") {
    await supabaseAdmin
      .from("credit_transactions")
      .update({ raw_webhook: payload })
      .eq("id", transaction.id);

    return NextResponse.json({ ok: true, idempotent: true });
  }

  if (nextStatus !== "paid") {
    await supabaseAdmin
      .from("credit_transactions")
      .update({
        payment_status: nextStatus,
        provider_payment_id: payload.id,
        raw_webhook: payload,
      })
      .eq("id", transaction.id);

    return NextResponse.json({ ok: true, status: nextStatus });
  }

  const { error: updateError } = await supabaseAdmin.rpc("apply_credit_purchase", {
    p_transaction_id: transaction.id,
    p_provider_payment_id: payload.id ?? null,
    p_raw_webhook: payload,
    p_paid_at: payload.paid_at ?? new Date().toISOString(),
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: "paid" });
}
