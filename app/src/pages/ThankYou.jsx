import { useTranslation } from 'react-i18next';

export default function ThankYou() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-ansaka-paper p-6">
      <div className="card max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-strong/10">
          <svg className="h-8 w-8 text-status-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 font-serif text-2xl font-semibold text-ansaka-ink">
          {t('survey.thankyou.title')}
        </h1>
        <p className="mt-3 text-sm text-ansaka-ink">{t('survey.thankyou.message')}</p>
        <p className="mt-2 text-xs text-ansaka-muted">{t('survey.thankyou.subtext')}</p>
      </div>
    </div>
  );
}
