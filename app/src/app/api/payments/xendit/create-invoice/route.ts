import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  price_idr: number;
  description: string | null;
};

function getAppUrl(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    `${request.nextUrl.protocol}//${request.nextUrl.host}`
  ).replace(/\/$/, "");
}

function getXenditAuthHeader() {
  const secretKey = process.env.XENDIT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("XENDIT_SECRET_KEY belum dikonfigurasi.");
  }

  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan." }, { status: 401 });
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
      return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
    }

    const { packageId } = (await request.json()) as { packageId?: string };

    if (!packageId) {
      return NextResponse.json({ error: "Paket kredit wajib dipilih." }, { status: 400 });
    }

    const [{ data: profile }, { data: creditPackage }] = await Promise.all([
      supabaseAdmin
        .from("users")
        .select("id, organization_id, email, full_name")
        .eq("id", user.id)
        .single(),
      supabaseAdmin
        .from("credit_packages")
        .select("id, name, credits, price_idr, description")
        .eq("id", packageId)
        .eq("is_active", true)
        .single<CreditPackage>(),
    ]);

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "Workspace tidak ditemukan." }, { status: 403 });
    }

    if (!creditPackage) {
      return NextResponse.json({ error: "Paket kredit tidak ditemukan." }, { status: 404 });
    }

    const appUrl = getAppUrl(request);
    const externalId = `ansaka-credit-${profile.organization_id}-${Date.now()}`;
    const description = `ANSAKA ${creditPackage.name} - ${creditPackage.credits} credits`;

    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("credit_transactions")
      .insert({
        organization_id: profile.organization_id,
        user_id: user.id,
        type: "purchase",
        amount: creditPackage.credits,
        package_id: creditPackage.id,
        payment_provider: "xendit",
        payment_status: "pending",
        external_id: externalId,
        notes: `Pending Xendit invoice for ${creditPackage.name}`,
      })
      .select("id")
      .single();

    if (transactionError || !transaction) {
      throw transactionError ?? new Error("Gagal membuat transaksi.");
    }

    const invoiceResponse = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        Authorization: getXenditAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: externalId,
        amount: creditPackage.price_idr,
        currency: "IDR",
        payer_email: profile.email ?? user.email,
        description,
        success_redirect_url: `${appUrl}/dashboard/credits?payment=success`,
        failure_redirect_url: `${appUrl}/dashboard/credits?payment=failed`,
        metadata: {
          transaction_id: transaction.id,
          organization_id: profile.organization_id,
          package_id: creditPackage.id,
          credits: creditPackage.credits,
        },
      }),
    });

    const invoice = await invoiceResponse.json();

    if (!invoiceResponse.ok) {
      await supabaseAdmin
        .from("credit_transactions")
        .update({
          payment_status: "failed",
          raw_webhook: invoice,
          notes: "Xendit invoice creation failed",
        })
        .eq("id", transaction.id);

      return NextResponse.json(
        { error: invoice?.message ?? "Gagal membuat invoice Xendit." },
        { status: 502 },
      );
    }

    await supabaseAdmin
      .from("credit_transactions")
      .update({
        provider_payment_id: invoice.id,
        checkout_url: invoice.invoice_url,
        raw_webhook: invoice,
      })
      .eq("id", transaction.id);

    return NextResponse.json({
      invoiceUrl: invoice.invoice_url,
      transactionId: transaction.id,
      externalId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
