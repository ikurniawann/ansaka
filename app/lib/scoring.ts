import {
  DEFAULT_WEIGHT_MAP,
  DRIVER_FPS,
  LAYERS,
  GAPS,
  STATUS_THRESHOLDS,
} from "./oam-constants";

export type RawAnswers = Record<string, Record<string, number>>;
// { "D1": { "Q1": 3, "Q2": 0, ... } }  — 0 = tidak tahu, excluded

export function computeFpScores(
  rawAnswers: RawAnswers,
  weightMap: Record<string, Record<string, Record<string, number>>> = DEFAULT_WEIGHT_MAP,
): Record<string, number> {
  const numerators: Record<string, number> = {};
  const denominators: Record<string, number> = {};

  for (const [driver, questions] of Object.entries(rawAnswers)) {
    const driverW = weightMap[driver];
    if (!driverW) continue;
    for (const [qKey, score] of Object.entries(questions)) {
      if (score === 0) continue; // tidak tahu → excluded
      const qWeights = driverW[qKey];
      if (!qWeights) continue;
      for (const [fp, weight] of Object.entries(qWeights)) {
        numerators[fp] = (numerators[fp] ?? 0) + score * weight;
        denominators[fp] = (denominators[fp] ?? 0) + weight;
      }
    }
  }

  const fpScores: Record<string, number> = {};
  for (const fp of Object.keys(numerators)) {
    if (denominators[fp] > 0) {
      fpScores[fp] = numerators[fp] / denominators[fp];
    }
  }
  return fpScores;
}

export function computeDriverScores(
  fpScores: Record<string, number>,
): Record<string, number> {
  const driverScores: Record<string, number> = {};
  for (const [driver, fps] of Object.entries(DRIVER_FPS)) {
    const valid = fps.map((fp) => fpScores[fp]).filter((s): s is number => s !== undefined);
    if (valid.length > 0) {
      driverScores[driver] = valid.reduce((a, b) => a + b, 0) / valid.length;
    }
  }
  return driverScores;
}

export function computeLayerScores(
  driverScores: Record<string, number>,
): Record<string, number> {
  const layerScores: Record<string, number> = {};
  for (const layer of LAYERS) {
    const valid = layer.drivers
      .map((d) => driverScores[d])
      .filter((s): s is number => s !== undefined);
    if (valid.length > 0) {
      layerScores[layer.id] = valid.reduce((a, b) => a + b, 0) / valid.length;
    }
  }
  return layerScores;
}

export function computeGapScores(
  fpScores: Record<string, number>,
): Record<string, number> {
  const gapScores: Record<string, number> = {};
  for (const gap of GAPS) {
    const valid = gap.fps
      .map((fp) => fpScores[fp])
      .filter((s): s is number => s !== undefined);
    if (valid.length > 0) {
      gapScores[gap.id] = valid.reduce((a, b) => a + b, 0) / valid.length;
    }
  }
  return gapScores;
}

export function computeOverallScore(driverScores: Record<string, number>): number {
  const scores = Object.values(driverScores).filter((s) => s !== undefined);
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function getStatus(score: number) {
  return (
    STATUS_THRESHOLDS.find((t) => score >= t.min && score < t.max) ??
    STATUS_THRESHOLDS[0]
  );
}

export function computeFullScores(
  rawAnswers: RawAnswers,
  weightMap?: Record<string, Record<string, Record<string, number>>>,
) {
  const fpScores = computeFpScores(rawAnswers, weightMap);
  const driverScores = computeDriverScores(fpScores);
  const layerScores = computeLayerScores(driverScores);
  const gapScores = computeGapScores(fpScores);
  const overallScore = computeOverallScore(driverScores);
  const status = getStatus(overallScore);
  return { fpScores, driverScores, layerScores, gapScores, overallScore, status };
}

// Average per-respondent scores into a batch aggregate
export function aggregateScores(
  responses: Array<{
    fp_scores: Record<string, number>;
    driver_scores: Record<string, number>;
    layer_scores: Record<string, number>;
    gap_scores: Record<string, number>;
  }>,
) {
  if (responses.length === 0) return null;

  function avgMaps(maps: Record<string, number>[]): Record<string, number> {
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    for (const m of maps) {
      for (const [k, v] of Object.entries(m)) {
        sums[k] = (sums[k] ?? 0) + v;
        counts[k] = (counts[k] ?? 0) + 1;
      }
    }
    const result: Record<string, number> = {};
    for (const k of Object.keys(sums)) result[k] = sums[k] / counts[k];
    return result;
  }

  const fpScores     = avgMaps(responses.map((r) => r.fp_scores     ?? {}));
  const driverScores = avgMaps(responses.map((r) => r.driver_scores ?? {}));
  const layerScores  = avgMaps(responses.map((r) => r.layer_scores  ?? {}));
  const gapScores    = avgMaps(responses.map((r) => r.gap_scores    ?? {}));
  const overallScore = computeOverallScore(driverScores);
  const status       = getStatus(overallScore);

  return { fpScores, driverScores, layerScores, gapScores, overallScore, status };
}
