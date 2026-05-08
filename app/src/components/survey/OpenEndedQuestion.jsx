import { useTranslation } from 'react-i18next';

export default function OpenEndedQuestion({ questionText, value, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-ansaka-gold/20 bg-ansaka-gold/5 p-5">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-ansaka-gold-dark">
        {t('survey.openEnded')}
      </p>
      <p className="mb-3 text-sm text-ansaka-ink leading-relaxed">{questionText}</p>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={t('survey.openEndedHelper')}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-ansaka-gold focus:outline-none focus:ring-1 focus:ring-ansaka-gold"
      />
    </div>
  );
}
