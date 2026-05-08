import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl font-semibold text-ansaka-ink">{t('nav.contact')}</h1>
      <p className="mt-3 text-ansaka-muted">
        Tertarik melakukan diagnostik organisasi? Hubungi kami.
      </p>

      <form
        className="card mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          alert('Contact form: integrasi email akan diaktifkan di Phase 5');
        }}
      >
        <div>
          <label className="block text-sm font-medium">Nama</label>
          <input required className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('auth.organizationName')}</label>
          <input required className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('auth.email')}</label>
          <input type="email" required className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Pesan</label>
          <textarea required rows={5} className="input-field mt-1" />
        </div>
        <button type="submit" className="btn-primary">{t('common.submit')}</button>
      </form>
    </div>
  );
}
