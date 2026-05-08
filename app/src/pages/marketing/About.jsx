import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl font-semibold text-ansaka-ink">{t('nav.about')}</h1>
      <div className="prose mt-6 max-w-none">
        <p>
          ANSAKA Consulting adalah bagian dari Mitologi Inspira Group. Kami menyediakan layanan
          Company Diagnosis, Consulting Services, dan LDaaS untuk membantu C-Level dan organisasi
          mencapai tujuan bisnis dengan menangani hambatan faktor manusia berbasis data.
        </p>
        <p className="mt-4">
          Framework diagnostik kami — Organizational Alignment Map (OAM) — mengidentifikasi akar masalah
          melalui 12 Drivers, 27 Failure Points, dan 6 Execution Gaps yang dipetakan ke 5 layer organisasi.
        </p>
      </div>
    </div>
  );
}
