# ANSAKA OAM Insight™

Platform diagnostik organisasi berbasis Organizational Alignment Map (OAM).
Phase 1 Foundation — full-stack scaffolding sesuai System Blueprint v1.0.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router 6
- **i18n:** react-i18next (Bahasa Indonesia / English)
- **Charts:** Recharts (Radar, Bar, Gauge)
- **Backend:** Supabase (PostgreSQL + Auth + RLS)

## Struktur Proyek

```
Dev_Ansaka/
├── app/                    # React + Vite SPA
│   ├── src/
│   │   ├── lib/            # Core utilities
│   │   │   ├── scoring.js          # OAM scoring engine (FP→Driver→Layer→Gap→Overall)
│   │   │   ├── weightMap.js        # Q→FP weight map (default seed)
│   │   │   ├── fpGapMap.js         # Locked OAM constants (12 D, 27 FP, 5 L, 6 G)
│   │   │   ├── supabase.js         # Supabase client
│   │   │   └── i18n.js             # i18next setup
│   │   ├── i18n/                   # Translation files (id.json, en.json)
│   │   ├── contexts/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── shared/             # LoadingScreen, ScoreChip, MaturityBadge, layouts
│   │   │   ├── survey/             # SurveyForm, DriverSection, LikertQuestion, etc.
│   │   │   ├── dashboard/          # ExecutiveSummary, PriorityHeatmap, LayerView, etc.
│   │   │   └── marketing/          # MarketingLayout
│   │   ├── pages/
│   │   │   ├── marketing/          # Home, Services, Insight, About, Contact
│   │   │   ├── auth/               # Login, Register
│   │   │   ├── dashboard/          # Overview, Batches, BatchDetail, Credits, Settings
│   │   │   ├── admin/              # Overview, Organizations, Batches, Credits, Packages,
│   │   │   │                       # Pricing, Formulas, Benchmark, CMS
│   │   │   ├── Survey.jsx          # Public survey form (no login)
│   │   │   └── ThankYou.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
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

Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari Supabase Dashboard → Settings → API.

### 3. Install & jalankan

```bash
npm install
npm run dev          # development at http://localhost:5173
npm run build        # production build → dist/
```

### 4. Buat Super Admin pertama

Setelah register lewat `/register`, naikkan role lewat Supabase SQL editor:

```sql
update public.users
   set role = 'super_admin'
 where email = 'youremail@example.com';
```

## Routes

### Public
| Route | Akses | Keterangan |
|-------|-------|------------|
| `/` | Public | Landing page (marketing) |
| `/services` | Public | Services |
| `/insight` | Public | Blog (Business Insight) |
| `/about` | Public | About Us |
| `/contact` | Public | Contact form |
| `/login` | Public | Login Corporate Admin |
| `/register` | Public | Register new client |
| `/survey/:token` | Public | Survey form (anonim, no login) |
| `/survey/:token/thankyou` | Public | Confirmation page |

### Corporate Admin (login required)
| Route | Keterangan |
|-------|------------|
| `/dashboard` | Overview (kredit, batches, transactions) |
| `/dashboard/batches` | Kelola survei batch + generate link |
| `/dashboard/batch/:id` | Hasil diagnostik (6 sections) |
| `/dashboard/credits` | Kelola kredit + paket pembelian |
| `/dashboard/settings` | Profil organisasi |

### Super Admin (role check required)
| Route | Keterangan |
|-------|------------|
| `/admin` | Platform overview |
| `/admin/organizations` | Daftar semua organisasi |
| `/admin/batches` | Semua survey batches |
| `/admin/credits` | Global credit transactions |
| `/admin/packages` | Edit credit packages |
| `/admin/pricing` | **Pricing tier editor** (free + paid scheme) |
| `/admin/formulas` | **OAM formula editor** (Q→FP weights, thresholds) |
| `/admin/benchmark` | Industry benchmark scores |
| `/admin/cms` | Content management (pages + blog posts) |

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
