import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-ansaka-gold">
            ANSAKA OAM Insight™
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-ansaka-ink sm:text-5xl">
            {t('marketing.hero.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ansaka-muted">
            {t('marketing.hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary">{t('marketing.hero.ctaPrimary')}</Link>
            <Link to="/services" className="btn-secondary">{t('marketing.hero.ctaSecondary')}</Link>
          </div>
        </div>
      </section>

      {/* Services snippet */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-serif text-3xl font-semibold text-ansaka-ink">
          {t('marketing.services.title')}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {['intelligence', 'diagnostic', 'solution', 'ldaas'].map((s) => (
            <div key={s} className="card text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-ansaka-gold">
                {t(`marketing.services.${s}.title`)}
              </p>
              <p className="mt-3 text-sm text-ansaka-ink">{t(`marketing.services.${s}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OAM framework intro */}
      <section className="bg-ansaka-ink py-16 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-ansaka-gold">
            Organizational Alignment Map
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">12 Drivers · 27 FPs · 6 Gaps</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-300">
            Framework diagnostik berbasis data yang membedah akar masalah organisasi melalui struktur 5 Layer dari Strategic Foundation hingga Individual Development.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-left sm:grid-cols-5">
            {['Strategic Foundation', 'Leadership System', 'Management Cascade', 'Team Execution', 'Individual Development'].map((l, i) => (
              <div key={l} className="rounded-md border border-gray-700 p-4">
                <p className="text-xs text-ansaka-gold">Layer {i + 1}</p>
                <p className="mt-1 text-sm font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
