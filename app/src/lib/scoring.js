/**
 * OAM Scoring Engine
 * ==================
 * Deterministic, reproducible scoring formula.
 *
 * Pipeline:
 *   raw answers (1-4 or 0=Don't Know)
 *     → FP scores (weighted average, exclude 0s)
 *     → Driver scores (avg of FPs in driver)
 *     → Layer scores (avg of Driver scores in layer)
 *     → Gap scores (avg of FPs mapped to gap)
 *     → Overall (avg of 12 Driver scores)
 *
 * Source: ANSAKA System Blueprint §3, OAM Insight Data Contract.
 */

import {
  DRIVERS,
  LAYERS,
  GAPS,
  FAILURE_POINTS,
  FPS_BY_DRIVER,
  FPS_BY_LAYER,
  FPS_BY_GAP,
} from './fpGapMap.js';
import { WEIGHT_MAP } from './weightMap.js';

// ============================================================
// CONSTANTS — score thresholds
// ============================================================
export const SCORE_STATUS = [
  { min: 1.0, max: 2.0, level: 'Critical', key: 'critical' },
  { min: 2.0, max: 2.8, level: 'Weak', key: 'weak' },
  { min: 2.8, max: 3.5, level: 'Stable', key: 'stable' },
  { min: 3.5, max: 4.01, level: 'Strong', key: 'strong' },
];

export const MATURITY_LEVELS = [
  { min: 0, max: 2.0, level: 'Fragile', focus_id: 'Perbaiki foundation', focus_en: 'Fix foundation' },
  { min: 2.0, max: 2.8, level: 'Developing', focus_id: 'Stabilkan sistem', focus_en: 'Stabilize system' },
  { min: 2.8, max: 3.5, level: 'Stable', focus_id: 'Optimasi area lemah', focus_en: 'Optimize weak areas' },
  { min: 3.5, max: 4.01, level: 'Performing', focus_id: 'Scaling & innovation', focus_en: 'Scaling & innovation' },
];

// ============================================================
// CORE: Compute FP scores from raw answers
// ============================================================
/**
 * @param {Object} rawAnswers - { D1: { Q1: 3, Q2: 0, ... }, D2: { ... }, ... }
 *                              0 = "Don't Know" → excluded from scoring
 * @param {Object} [weightMap] - optional override of WEIGHT_MAP (from DB)
 * @returns {Object} fpScores - { FP1: 2.78, FP2: 3.10, ... } or null if no valid answers
 */
export function computeFPScores(rawAnswers, weightMap = WEIGHT_MAP) {
  const fpAccum = {}; // FP_id → { weighted: sum, weight: sum }

  // Initialize all 27 FPs
  FAILURE_POINTS.forEach((fp) => {
    fpAccum[fp.id] = { weighted: 0, weight: 0 };
  });

  // Walk through every driver's questions
  for (const [driverId, qs] of Object.entries(weightMap)) {
    const driverAnswers = rawAnswers[driverId] || {};
    for (const [qId, fpWeights] of Object.entries(qs)) {
      const score = driverAnswers[qId];
      // Excluded if 0 (Don't Know) or missing/invalid
      if (score == null || score === 0 || score < 1 || score > 4) continue;

      for (const [fpId, weight] of Object.entries(fpWeights)) {
        if (!fpAccum[fpId]) continue;
        fpAccum[fpId].weighted += score * weight;
        fpAccum[fpId].weight += weight;
      }
    }
  }

  // Compute final FP scores
  const fpScores = {};
  for (const [fpId, { weighted, weight }] of Object.entries(fpAccum)) {
    fpScores[fpId] = weight > 0 ? round2(weighted / weight) : null;
  }
  return fpScores;
}

// ============================================================
// Driver Score = mean of FP scores within driver
// ============================================================
export function computeDriverScores(fpScores) {
  const driverScores = {};
  for (const driver of DRIVERS) {
    const fps = FPS_BY_DRIVER[driver.id] || [];
    const validScores = fps.map((f) => fpScores[f]).filter((s) => s != null);
    driverScores[driver.id] = validScores.length
      ? round2(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : null;
  }
  return driverScores;
}

// ============================================================
// Layer Score = mean of Driver scores in layer
// ============================================================
export function computeLayerScores(driverScores) {
  const layerScores = {};
  for (const layer of LAYERS) {
    const validScores = layer.drivers.map((d) => driverScores[d]).filter((s) => s != null);
    layerScores[layer.id] = validScores.length
      ? round2(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : null;
  }
  return layerScores;
}

// ============================================================
// Gap Hypothesis Score = mean of FP scores mapped to gap
// ============================================================
export function computeGapScores(fpScores) {
  const gapScores = {};
  for (const gap of GAPS) {
    const fps = FPS_BY_GAP[gap.id] || [];
    const validScores = fps.map((f) => fpScores[f]).filter((s) => s != null);
    gapScores[gap.id] = validScores.length
      ? round2(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : null;
  }
  return gapScores;
}

// ============================================================
// Overall Score = mean of 12 Driver scores
// ============================================================
export function computeOverallScore(driverScores) {
  const valid = Object.values(driverScores).filter((s) => s != null);
  return valid.length ? round2(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
}

// ============================================================
// Top-level: full submission scoring
// ============================================================
export function computeFullScores(rawAnswers, weightMap = WEIGHT_MAP) {
  const fpScores = computeFPScores(rawAnswers, weightMap);
  const driverScores = computeDriverScores(fpScores);
  const layerScores = computeLayerScores(driverScores);
  const gapScores = computeGapScores(fpScores);
  const overall = computeOverallScore(driverScores);
  return { fpScores, driverScores, layerScores, gapScores, overall };
}

// ============================================================
// AGGREGATION: average scores across multiple respondents
// ============================================================
/**
 * Combine many submissions (one per respondent) into a batch-level result.
 * @param {Array<{fpScores, driverScores, layerScores, gapScores}>} submissions
 */
export function aggregateBatch(submissions) {
  if (!submissions.length) return null;

  const aggKey = (key) => {
    const acc = {};
    for (const sub of submissions) {
      for (const [k, v] of Object.entries(sub[key] || {})) {
        if (v == null) continue;
        if (!acc[k]) acc[k] = { sum: 0, n: 0 };
        acc[k].sum += v;
        acc[k].n += 1;
      }
    }
    const out = {};
    for (const [k, { sum, n }] of Object.entries(acc)) {
      out[k] = n > 0 ? round2(sum / n) : null;
    }
    return out;
  };

  const fpScores = aggKey('fpScores');
  const driverScores = aggKey('driverScores');
  const layerScores = aggKey('layerScores');
  const gapScores = aggKey('gapScores');
  const overall = computeOverallScore(driverScores);

  return {
    fpScores,
    driverScores,
    layerScores,
    gapScores,
    overall,
    respondentCount: submissions.length,
  };
}

// ============================================================
// Helpers
// ============================================================
export function round2(n) {
  return Math.round(n * 100) / 100;
}

export function getScoreStatus(score) {
  if (score == null) return null;
  return SCORE_STATUS.find((s) => score >= s.min && score < s.max) || SCORE_STATUS[3];
}

export function getMaturityLevel(score) {
  if (score == null) return null;
  return MATURITY_LEVELS.find((m) => score >= m.min && score < m.max) || MATURITY_LEVELS[3];
}

/**
 * Top 3 weakest FPs within a driver — for the Driver Deep Dive section
 */
export function getTop3WeakestFPs(driverId, fpScores) {
  const fps = FPS_BY_DRIVER[driverId] || [];
  return fps
    .map((id) => ({ id, score: fpScores[id] }))
    .filter((f) => f.score != null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
}

/**
 * Sort drivers from worst to best — Priority Heatmap
 */
export function sortDriversByPriority(driverScores) {
  return Object.entries(driverScores)
    .filter(([, score]) => score != null)
    .sort((a, b) => a[1] - b[1])
    .map(([id, score]) => ({ id, score }));
}

/**
 * Dynamic profile labels (executive summary)
 */
export function getOrgProfile(driverScores, lang = 'id') {
  const overall = computeOverallScore(driverScores);
  if (overall == null) return null;

  const d1 = driverScores.D1 || 0;
  const d3 = driverScores.D3 || 0;
  const d6 = driverScores.D6 || 0;
  const d7 = driverScores.D7 || 0;
  const allHigh = Object.values(driverScores).every((s) => s != null && s > 3.4);

  if (allHigh) {
    return lang === 'id' ? 'Organisasi Performa Tinggi' : 'High Performance Organization';
  }
  if (d1 > 3.2 && d3 < 2.8) {
    return lang === 'id' ? 'Pemimpin Visi Tanpa Eksekusi' : 'The Visionary Without Execution';
  }
  if (d6 < 2.8 && d7 < 2.8) {
    return lang === 'id' ? 'Hambatan Eksekusi' : 'The Execution Bottleneck';
  }
  if (d3 < 2.8 && d1 < 2.8) {
    return lang === 'id' ? 'Arsitek Strategis (Belum Stabil)' : 'The Strategic Architect';
  }
  return lang === 'id' ? 'Profil Organisasi Campuran' : 'Mixed Organizational Profile';
}
