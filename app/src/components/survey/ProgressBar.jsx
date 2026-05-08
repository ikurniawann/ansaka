import { useTranslation } from 'react-i18next';

export default function ProgressBar({ current, total }) {
  const { t } = useTranslation();
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-ansaka-muted">
        <span>{t('survey.progress', { current, total })}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-ansaka-gold transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
