import { useTranslation } from 'react-i18next';
import { getScoreStatus } from '../../lib/scoring.js';

const STATUS_CLASS = {
  critical: 'bg-status-critical text-white',
  weak: 'bg-status-weak text-white',
  stable: 'bg-status-stable text-white',
  strong: 'bg-status-strong text-white',
};

export default function ScoreChip({ score, showLevel = true }) {
  const { t } = useTranslation();
  if (score == null) return <span className="text-xs text-gray-400">—</span>;
  const status = getScoreStatus(score);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASS[status.key]}`}>
      <span className="font-semibold">{score.toFixed(2)}</span>
      {showLevel && <span className="opacity-90">{t(`scoreLevels.${status.level}`)}</span>}
    </span>
  );
}
