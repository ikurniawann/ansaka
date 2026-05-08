import { useTranslation } from 'react-i18next';
import { getMaturityLevel } from '../../lib/scoring.js';

export default function MaturityBadge({ score }) {
  const { t, i18n } = useTranslation();
  if (score == null) return null;
  const m = getMaturityLevel(score);
  if (!m) return null;
  return (
    <div className="inline-flex flex-col rounded-md border border-ansaka-gold/30 bg-ansaka-gold/5 px-4 py-2">
      <span className="text-xs font-medium uppercase tracking-wider text-ansaka-muted">
        Maturity Level
      </span>
      <span className="text-lg font-semibold text-ansaka-gold-dark">{t(`scoreLevels.${m.level}`)}</span>
      <span className="text-xs text-ansaka-muted">{i18n.language === 'id' ? m.focus_id : m.focus_en}</span>
    </div>
  );
}
