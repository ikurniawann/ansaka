import { useTranslation } from 'react-i18next';

const LIKERT_OPTIONS = [1, 2, 3, 4];

export default function LikertQuestion({ questionId, questionText, value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="mb-4 text-sm font-medium text-ansaka-ink leading-relaxed">{questionText}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {LIKERT_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(questionId, opt)}
            className={`rounded-md border px-3 py-2.5 text-xs font-medium transition-colors ${
              value === opt
                ? 'border-ansaka-gold bg-ansaka-gold text-white'
                : 'border-gray-300 bg-white text-ansaka-ink hover:border-ansaka-gold/50'
            }`}
          >
            <div className="text-base font-semibold">{opt}</div>
            <div className="mt-1 leading-tight">{t(`survey.scale.${opt}`)}</div>
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(questionId, 0)}
          className={`rounded-md border px-3 py-2.5 text-xs font-medium transition-colors ${
            value === 0
              ? 'border-ansaka-muted bg-ansaka-muted text-white'
              : 'border-gray-300 bg-white text-ansaka-muted hover:border-ansaka-muted/50'
          }`}
        >
          <div className="text-base font-semibold">—</div>
          <div className="mt-1 leading-tight">{t('survey.scale.0')}</div>
        </button>
      </div>
    </div>
  );
}
