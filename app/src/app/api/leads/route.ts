import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

const MAX_LEN = {
  name: 120,
  email: 200,
  phone: 40,
  company: 200,
  size: 50,
  industry: 80,
  message: 2000,
  source: 80,
};

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  size?: string;
  industry?: string;
  message?: string;
  source?: string;
};

function sanitize(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let payload: LeadPayload = {};
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = sanitize(payload.name, MAX_LEN.name);
  const email = sanitize(payload.email, MAX_LEN.email);
  const phone = sanitize(payload.phone, MAX_LEN.phone);
  const company = sanitize(payload.company, MAX_LEN.company);
  const size = sanitize(payload.size, MAX_LEN.size);
  const industry = sanitize(payload.industry, MAX_LEN.industry);
  const message = sanitize(payload.message, MAX_LEN.message);
  const source = sanitize(payload.source, MAX_LEN.source) ?? "landing";

  if (!name || !email || !company) {
    return NextResponse.json(
      { error: "missing_required_fields", fields: ["name", "email", "company"] },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // Best-effort persist. We tolerate the table not yet existing; the form should
  // not surface DB errors to the user.
  try {
    await supabaseAdmin.from("landing_leads").insert({
      name,
      email,
      phone,
      company,
      size,
      industry,
      message,
      source,
      received_at: new Date().toISOString(),
    });
  } catch (err) {
    // swallow — log on server and keep UX fast
    console.error("[leads] insert failed", err);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, name: "ansaka-leads-endpoint" });
}
