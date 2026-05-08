import { useTranslation } from 'react-i18next';

const SERVICES = [
  { key: 'intelligence', step: 1 },
  { key: 'diagnostic', step: 2 },
  { key: 'solution', step: 3 },
  { key: 'ldaas', step: 4 },
];

export default function Services() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-serif text-4xl font-semibold text-ansaka-ink">
        {t('marketing.services.title')}
      </h1>
      <p className="mt-3 text-ansaka-muted">
        Tiga langkah menuju Tim dan organisasi yang Sinergis & Efektif: Ansaka → Inspira → LDaaS.
      </p>
      <div className="mt-10 space-y-4">
        {SERVICES.map((s) => (
          <div key={s.key} className="card flex gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ansaka-gold text-white font-semibold">
              {s.step}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ansaka-ink">
                {t(`marketing.services.${s.key}.title`)}
              </h2>
              <p className="mt-2 text-sm text-ansaka-ink">{t(`marketing.services.${s.key}.desc`)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
