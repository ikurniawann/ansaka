import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LanguageSwitcher from '../../components/shared/LanguageSwitcher.jsx';

const SIZE_OPTIONS = ['1-50', '51-200', '201-500', '501-1000', '1000+'];
const INDUSTRY_OPTIONS = [
  'Finance', 'Technology', 'Manufacturing', 'Retail', 'Healthcare',
  'Education', 'Energy', 'Telecommunications', 'Government', 'Other',
];

export default function Register() {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    organizationName: '',
    industry: '',
    sizeRange: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ansaka-paper p-6">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="card w-full max-w-md">
        <Link to="/" className="block text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-ansaka-gold">
            ANSAKA OAM Insight™
          </p>
        </Link>
        <h1 className="mt-4 text-center font-serif text-2xl font-semibold text-ansaka-ink">
          {t('auth.registerTitle')}
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-ansaka-ink">Full Name</label>
            <input type="text" required value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ansaka-ink">{t('auth.organizationName')}</label>
            <input type="text" required value={form.organizationName}
              onChange={(e) => update('organizationName', e.target.value)} className="input-field mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ansaka-ink">{t('auth.industry')}</label>
              <select required value={form.industry}
                onChange={(e) => update('industry', e.target.value)} className="input-field mt-1">
                <option value="">—</option>
                {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ansaka-ink">{t('auth.sizeRange')}</label>
              <select required value={form.sizeRange}
                onChange={(e) => update('sizeRange', e.target.value)} className="input-field mt-1">
                <option value="">—</option>
                {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ansaka-ink">{t('auth.email')}</label>
            <input type="email" required value={form.email}
              onChange={(e) => update('email', e.target.value)} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ansaka-ink">{t('auth.password')}</label>
            <input type="password" required minLength={8} value={form.password}
              onChange={(e) => update('password', e.target.value)} className="input-field mt-1" />
          </div>
          {error && <p className="text-sm text-status-critical">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('common.loading') : t('common.register')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-ansaka-muted">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="font-medium text-ansaka-gold hover:underline">
            {t('common.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
