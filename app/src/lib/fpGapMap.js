/**
 * OAM Insight™ — Locked Constants
 * Source: OAM Insight App Locked Contract v1.0
 *
 * DO NOT modify these IDs/labels in new submissions. They are locked
 * by the Data Contract for backward compatibility & analyst app validation.
 */

// ============================================================
// 12 DRIVERS
// ============================================================
export const DRIVERS = [
  { id: 'D1', name_id: 'Vision & Direction Clarity', name_en: 'Vision & Direction Clarity' },
  { id: 'D2', name_id: 'Strategy & Priority to Team Alignment', name_en: 'Strategy & Priority to Team Alignment' },
  { id: 'D3', name_id: 'Leadership Alignment & Consistency', name_en: 'Leadership Alignment & Consistency' },
  { id: 'D4', name_id: 'Role & Responsibility Clarity', name_en: 'Role & Responsibility Clarity' },
  { id: 'D5', name_id: 'Decision Making Effectiveness', name_en: 'Decision Making Effectiveness' },
  { id: 'D6', name_id: 'Management System Alignment & KPI Clarity', name_en: 'Management System Alignment & KPI Clarity' },
  { id: 'D7', name_id: 'Performance & Accountability', name_en: 'Performance & Accountability' },
  { id: 'D8', name_id: 'Communication Flow', name_en: 'Communication Flow' },
  { id: 'D9', name_id: 'Cross-Team Collaboration', name_en: 'Cross-Team Collaboration' },
  { id: 'D10', name_id: 'Capability & Skill Readiness', name_en: 'Capability & Skill Readiness' },
  { id: 'D11', name_id: 'Ownership & Initiative', name_en: 'Ownership & Initiative' },
  { id: 'D12', name_id: 'Feedback & Continuous Learning', name_en: 'Feedback & Continuous Learning' },
];

// ============================================================
// 5 LAYERS
// ============================================================
export const LAYERS = [
  { id: 'strategic_foundation', label_id: 'Strategic Foundation', label_en: 'Strategic Foundation', drivers: ['D1'] },
  { id: 'leadership_system', label_id: 'Leadership System', label_en: 'Leadership System', drivers: ['D3', 'D4', 'D5'] },
  { id: 'management_cascade', label_id: 'Management Cascade', label_en: 'Management Cascade', drivers: ['D2', 'D6'] },
  { id: 'team_execution', label_id: 'Team Execution', label_en: 'Team Execution', drivers: ['D7', 'D8', 'D9'] },
  { id: 'individual_development', label_id: 'Individual Development', label_en: 'Individual Development', drivers: ['D10', 'D11', 'D12'] },
];

// ============================================================
// 6 EXECUTION GAPS (final, no deprecated)
// ============================================================
export const GAPS = [
  { id: 'strategic_clarity', label_id: 'Strategic Clarity Gap', label_en: 'Strategic Clarity Gap' },
  { id: 'leadership_alignment', label_id: 'Leadership Alignment Gap', label_en: 'Leadership Alignment Gap' },
  { id: 'execution_system', label_id: 'Execution System Gap', label_en: 'Execution System Gap' },
  { id: 'collaboration', label_id: 'Collaboration Gap', label_en: 'Collaboration Gap' },
  { id: 'capability_fit', label_id: 'Capability Fit Gap', label_en: 'Capability Fit Gap' },
  { id: 'culture_engagement', label_id: 'Culture Engagement Gap', label_en: 'Culture Engagement Gap' },
];

export const DEPRECATED_GAP_IDS = ['strategy_translation', 'capability'];

// ============================================================
// 27 FAILURE POINTS
// ============================================================
export const FAILURE_POINTS = [
  { id: 'FP1', label_id: 'Vision Clarity', label_en: 'Vision Clarity', driver: 'D1', layer: 'strategic_foundation', primaryGap: 'strategic_clarity' },
  { id: 'FP2', label_id: 'Strategy Clarity', label_en: 'Strategy Clarity', driver: 'D1', layer: 'strategic_foundation', primaryGap: 'strategic_clarity' },
  { id: 'FP3', label_id: 'Priority Clarity', label_en: 'Priority Clarity', driver: 'D1', layer: 'strategic_foundation', primaryGap: 'strategic_clarity' },
  { id: 'FP4', label_id: 'Goal Clarity', label_en: 'Goal Clarity', driver: 'D1', layer: 'strategic_foundation', primaryGap: 'strategic_clarity' },
  { id: 'FP5', label_id: 'Strategy Translation', label_en: 'Strategy Translation', driver: 'D1', layer: 'strategic_foundation', primaryGap: 'execution_system' },
  { id: 'FP6', label_id: 'Leadership Alignment', label_en: 'Leadership Alignment', driver: 'D3', layer: 'leadership_system', primaryGap: 'leadership_alignment' },
  { id: 'FP7', label_id: 'Leadership Consistency', label_en: 'Leadership Consistency', driver: 'D3', layer: 'leadership_system', primaryGap: 'leadership_alignment' },
  { id: 'FP8', label_id: 'Role Clarity', label_en: 'Role Clarity', driver: 'D4', layer: 'leadership_system', primaryGap: 'execution_system' },
  { id: 'FP9', label_id: 'Decision Authority', label_en: 'Decision Authority', driver: 'D5', layer: 'leadership_system', primaryGap: 'execution_system' },
  { id: 'FP10', label_id: 'Decision Effectiveness', label_en: 'Decision Effectiveness', driver: 'D5', layer: 'leadership_system', primaryGap: 'execution_system' },
  { id: 'FP11', label_id: 'Leadership Accountability', label_en: 'Leadership Accountability', driver: 'D7', layer: 'leadership_system', primaryGap: 'leadership_alignment' },
  { id: 'FP12', label_id: 'Strategy Cascade', label_en: 'Strategy Cascade', driver: 'D2', layer: 'management_cascade', primaryGap: 'execution_system' },
  { id: 'FP13', label_id: 'Goal Cascade', label_en: 'Goal Cascade', driver: 'D6', layer: 'management_cascade', primaryGap: 'execution_system' },
  { id: 'FP14', label_id: 'KPI Ownership', label_en: 'KPI Ownership', driver: 'D6', layer: 'management_cascade', primaryGap: 'execution_system' },
  { id: 'FP15', label_id: 'Performance Monitoring', label_en: 'Performance Monitoring', driver: 'D6', layer: 'management_cascade', primaryGap: 'execution_system' },
  { id: 'FP16', label_id: 'Cross-Team Alignment', label_en: 'Cross-Team Alignment', driver: 'D9', layer: 'management_cascade', primaryGap: 'collaboration' },
  { id: 'FP17', label_id: 'Communication Flow', label_en: 'Communication Flow', driver: 'D8', layer: 'management_cascade', primaryGap: 'collaboration' },
  { id: 'FP18', label_id: 'Cross-Team Collaboration', label_en: 'Cross-Team Collaboration', driver: 'D9', layer: 'team_execution', primaryGap: 'collaboration' },
  { id: 'FP19', label_id: 'Team Collaboration', label_en: 'Team Collaboration', driver: 'D9', layer: 'team_execution', primaryGap: 'collaboration' },
  { id: 'FP20', label_id: 'Decision Speed', label_en: 'Decision Speed', driver: 'D5', layer: 'team_execution', primaryGap: 'collaboration' },
  { id: 'FP21', label_id: 'Team Accountability', label_en: 'Team Accountability', driver: 'D7', layer: 'team_execution', primaryGap: 'culture_engagement' },
  { id: 'FP22', label_id: 'Problem Solving', label_en: 'Problem Solving', driver: 'D10', layer: 'team_execution', primaryGap: 'capability_fit' },
  { id: 'FP23', label_id: 'Skill Capability', label_en: 'Skill Capability', driver: 'D10', layer: 'individual_development', primaryGap: 'capability_fit' },
  { id: 'FP24', label_id: 'Initiative', label_en: 'Initiative', driver: 'D11', layer: 'individual_development', primaryGap: 'culture_engagement' },
  { id: 'FP25', label_id: 'Ownership Mindset', label_en: 'Ownership Mindset', driver: 'D11', layer: 'individual_development', primaryGap: 'culture_engagement' },
  { id: 'FP26', label_id: 'Feedback System', label_en: 'Feedback System', driver: 'D12', layer: 'individual_development', primaryGap: 'culture_engagement' },
  { id: 'FP27', label_id: 'Learning System', label_en: 'Learning System', driver: 'D12', layer: 'individual_development', primaryGap: 'culture_engagement' },
];

// Build helpers
export const FP_BY_ID = Object.fromEntries(FAILURE_POINTS.map((fp) => [fp.id, fp]));
export const DRIVER_BY_ID = Object.fromEntries(DRIVERS.map((d) => [d.id, d]));
export const LAYER_BY_ID = Object.fromEntries(LAYERS.map((l) => [l.id, l]));
export const GAP_BY_ID = Object.fromEntries(GAPS.map((g) => [g.id, g]));

export const FPS_BY_DRIVER = DRIVERS.reduce((acc, d) => {
  acc[d.id] = FAILURE_POINTS.filter((fp) => fp.driver === d.id).map((fp) => fp.id);
  return acc;
}, {});

export const FPS_BY_LAYER = LAYERS.reduce((acc, l) => {
  acc[l.id] = FAILURE_POINTS.filter((fp) => fp.layer === l.id).map((fp) => fp.id);
  return acc;
}, {});

export const FPS_BY_GAP = GAPS.reduce((acc, g) => {
  acc[g.id] = FAILURE_POINTS.filter((fp) => fp.primaryGap === g.id).map((fp) => fp.id);
  return acc;
}, {});
