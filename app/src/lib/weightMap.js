/**
 * Question → Failure Point Weight Map
 * Source: "Questions and Scoring 12 Drivers Survey" v1.0
 *
 * Each entry: D{n}_Q{m} → { FP_id: weight }
 * Weights sum to ~1.0 per question and represent how much each FP
 * is influenced by that question's response.
 *
 * NOTE: This is the DEFAULT seed map. The actual runtime weights are
 * loaded from the `oam_formulas` table in Supabase, allowing Super Admin
 * to adjust weights without code changes.
 */

export const WEIGHT_MAP = {
  // ===== DRIVER 1 — VISION & DIRECTION CLARITY =====
  D1: {
    Q1: { FP1: 0.7, FP2: 0.3 },
    Q2: { FP2: 0.7, FP5: 0.3 },
    Q3: { FP2: 0.2, FP3: 0.7, FP5: 0.1 },
    Q4: { FP4: 0.7, FP5: 0.3 },
    Q5: { FP2: 0.2, FP5: 0.8 },
    Q6: { FP1: 0.2, FP2: 0.3, FP3: 0.2, FP4: 0.3 },
  },

  // ===== DRIVER 2 — STRATEGY & PRIORITY TO TEAM ALIGNMENT =====
  D2: {
    Q1: { FP12: 0.3 },
    Q2: { FP12: 0.3 },
    Q3: { FP12: 0.2 },
    Q4: { FP12: 0.2 },
  },

  // ===== DRIVER 3 — LEADERSHIP ALIGNMENT & CONSISTENCY =====
  D3: {
    Q1: { FP6: 0.7, FP7: 0.3 },
    Q2: { FP6: 0.8, FP7: 0.2 },
    Q3: { FP6: 0.2, FP7: 0.8 },
    Q4: { FP6: 0.3, FP7: 0.7 },
  },

  // ===== DRIVER 4 — ROLE & RESPONSIBILITY CLARITY =====
  D4: {
    Q1: { FP8: 0.25 },
    Q2: { FP8: 0.3 },
    Q3: { FP8: 0.25 },
    Q4: { FP8: 0.2 },
  },

  // ===== DRIVER 5 — DECISION MAKING EFFECTIVENESS =====
  D5: {
    Q1: { FP9: 0.8, FP10: 0.2 },
    Q2: { FP9: 0.7, FP20: 0.3 },
    Q3: { FP10: 0.8, FP20: 0.2 },
    Q4: { FP10: 0.8, FP20: 0.2 },
    Q5: { FP10: 0.2, FP20: 0.8 },
    Q6: { FP9: 0.3, FP20: 0.7 },
  },

  // ===== DRIVER 6 — MANAGEMENT SYSTEM ALIGNMENT & KPI CLARITY =====
  D6: {
    Q1: { FP13: 0.7, FP14: 0.3 },
    Q2: { FP13: 0.8, FP14: 0.2 },
    Q3: { FP15: 0.8, FP14: 0.2 },
    Q4: { FP15: 0.8, FP14: 0.2 },
    Q5: { FP14: 1.0 },
    Q6: { FP13: 0.2, FP15: 0.3, FP14: 0.5 },
  },

  // ===== DRIVER 7 — PERFORMANCE & ACCOUNTABILITY =====
  D7: {
    Q1: { FP21: 0.7, FP11: 0.3 },
    Q2: { FP21: 0.8, FP11: 0.2 },
    Q3: { FP21: 0.3, FP11: 0.7 },
    Q4: { FP21: 0.2, FP11: 0.8 },
    Q5: { FP21: 0.7, FP11: 0.3 },
  },

  // ===== DRIVER 8 — COMMUNICATION FLOW =====
  D8: {
    Q1: { FP17: 0.3 },
    Q2: { FP17: 0.25 },
    Q3: { FP17: 0.2 },
    Q4: { FP17: 0.25 },
  },

  // ===== DRIVER 9 — CROSS-TEAM COLLABORATION =====
  D9: {
    Q1: { FP16: 0.8, FP18: 0.2 },
    Q2: { FP18: 0.8, FP19: 0.2 },
    Q3: { FP16: 0.2, FP18: 0.8 },
    Q4: { FP18: 0.2, FP19: 0.8 },
    Q5: { FP16: 0.2, FP19: 0.8 },
  },

  // ===== DRIVER 10 — CAPABILITY & SKILL READINESS =====
  D10: {
    Q1: { FP22: 0.8, FP23: 0.2 },
    Q2: { FP22: 0.8, FP23: 0.2 },
    Q3: { FP22: 0.2, FP23: 0.8 },
    Q4: { FP22: 0.2, FP23: 0.8 },
    Q5: { FP22: 0.7, FP23: 0.3 },
  },

  // ===== DRIVER 11 — OWNERSHIP & INITIATIVE =====
  D11: {
    Q1: { FP24: 0.6, FP25: 0.4 },
    Q2: { FP24: 0.8, FP25: 0.2 },
    Q3: { FP24: 0.8, FP25: 0.2 },
    Q4: { FP24: 0.2, FP25: 0.8 },
    Q5: { FP24: 0.3, FP25: 0.7 },
  },

  // ===== DRIVER 12 — FEEDBACK & CONTINUOUS LEARNING =====
  D12: {
    Q1: { FP26: 0.8, FP27: 0.2 },
    Q2: { FP26: 0.7, FP27: 0.3 },
    Q3: { FP26: 0.3, FP27: 0.7 },
    Q4: { FP26: 0.2, FP27: 0.8 },
    Q5: { FP26: 0.2, FP27: 0.8 },
  },
};

/**
 * Number of Likert questions per driver
 */
export const QUESTIONS_PER_DRIVER = Object.fromEntries(
  Object.entries(WEIGHT_MAP).map(([d, qs]) => [d, Object.keys(qs).length])
);
