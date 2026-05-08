# ANSAKA OAM Insight™

Platform diagnostik organisasi berbasis Organizational Alignment Map (OAM).
Phase 1 Foundation — full-stack scaffolding sesuai System Blueprint v1.0.

## Tech Stack

- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui-style primitives + Aceternity-inspired motion components
- **Motion:** Framer Motion parallax hero
- **Theme:** `next-themes` dark/light mode
- **Backend:** Supabase (PostgreSQL + Auth + RLS)

## Struktur Proyek

```
Dev_Ansaka/
├── app/                    # Next.js 15 application
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx          # App shell + theme provider
│   │       ├── page.tsx            # Landing page
│   │       └── globals.css         # Design tokens and Tailwind layers
│   ├── components/
│   │   ├── aceternity/             # Motion/background inspired components
│   │   ├── ui/                     # shadcn/ui-style primitives
│   │   ├── hero-parallax.tsx
│   │   ├── site-header.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── .env.example
├── supabase/
│   └── migrations/
│       ├── 0001_core_schema.sql       # 8 core tables
│       ├── 0002_rls_policies.sql      # Row Level Security
│       ├── 0003_extra_features.sql    # pricing_tiers, oam_formulas, cms_*, benchmarks
│       └── 0004_seed_data.sql         # Default packages, tiers, formula
└── README.md
```

## Setup

### 1. Apply Supabase migrations

Buka Supabase Dashboard → SQL Editor → jalankan file dalam urutan:

```
supabase/migrations/0001_core_schema.sql
supabase/migrations/0002_rls_policies.sql
supabase/migrations/0003_extra_features.sql
supabase/migrations/0004_seed_data.sql
```

### 2. Configure environment

```bash
cd app
cp .env.example .env
```

Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari Supabase Dashboard → Settings → API.

### 3. Install & jalankan

```bash
npm install next@15 react@19 react-dom@19 @radix-ui/react-slot class-variance-authority clsx framer-motion lucide-react next-themes tailwind-merge @supabase/supabase-js
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer eslint eslint-config-next tailwindcss-animate
npm run dev          # development at http://localhost:3000
npm run build        # production build → .next/
```

### 4. Buat Super Admin pertama

Setelah register lewat `/register`, naikkan role lewat Supabase SQL editor:

```sql
update public.users
   set role = 'super_admin'
 where email = 'youremail@example.com';
```

## Routes

### Current Next.js app
| Route | Akses | Keterangan |
|-------|-------|------------|
| `/` | Public | Premium landing page dengan smooth parallax hero |

## OAM Framework (locked constants)

- **12 Drivers** (D1–D12)
- **27 Failure Points** (FP1–FP27)
- **5 Layers**: Strategic Foundation, Leadership System, Management Cascade, Team Execution, Individual Development
- **6 Execution Gaps**: Strategic Clarity, Leadership Alignment, Execution System, Collaboration, Capability Fit, Culture Engagement

Scoring formula (per System Blueprint §3):

```
FP Score    = Σ(Q_score × weight) / Σ(weight of valid answers)
              (jawaban "Tidak Tahu" = 0 → excluded)
Driver      = mean(FP scores in driver)
Layer       = mean(Driver scores in layer)
Gap         = mean(FP scores mapped to gap)
Overall     = mean(12 Driver scores)
```

## Custom Features (di luar System Blueprint)

1. **Pricing Tier Editor** (`/admin/pricing`) — admin bisa setting skema fleksibel:
   misalnya tier 1 (link 0–30, gratis) + tier 2 (link 31+, Rp 100,000/link).
2. **OAM Formula Editor** (`/admin/formulas`) — admin bisa adjust Q→FP weights,
   status thresholds (Critical/Weak/Stable/Strong), dan activate version baru.
   Hanya 1 formula aktif pada satu waktu (enforced by partial unique index).

## Build Phases (per Blueprint)

| Phase | Status | Deliverable |
|-------|--------|-------------|
| 1. Foundation | ✅ Done | Schema, Survey form, Scoring engine, i18n |
| 2. Auth & Management | ✅ Done | Auth, Batch management, Credit UI, Generate link |
| 3. Dashboard | ✅ Done | 6 dashboard sections (Executive Summary, Priority Heatmap, Layer View, Driver Deep Dive, Pattern Intelligence, Sentiment placeholder) |
| 4. Super Admin & Advanced | ✅ Done (core) | Super Admin panel, OAM editor, Pricing editor, CMS, Benchmark |
| 5. Production | 🔜 Planned | Payment gateway (Midtrans/Xendit), Email notif, AI Sentiment, SEO |

## Testing scoring engine

Quick sanity check di browser console (after `npm run dev`):

```js
import('./src/lib/scoring.js').then(m => {
  const r = m.computeFullScores({
    D1: { Q1: 3, Q2: 2, Q3: 3, Q4: 4, Q5: 0, Q6: 3 },
  });
  console.log(r);
});
```

## License

Proprietary © Ansaka Consulting / Mitologi Inspira Group.
