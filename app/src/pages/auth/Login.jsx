import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LanguageSwitcher from '../../components/shared/LanguageSwitcher.jsx';

export default function Login() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
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
          {t('auth.loginTitle')}
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ansaka-ink">{t('auth.email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ansaka-ink">{t('auth.password')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-1"
            />
          </div>
          {error && <p className="text-sm text-status-critical">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('common.loading') : t('common.login')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-ansaka-muted">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-medium text-ansaka-gold hover:underline">
            {t('common.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
