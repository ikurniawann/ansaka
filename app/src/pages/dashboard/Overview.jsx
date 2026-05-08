import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { supabase } from '../../lib/supabase.js';
import LoadingScreen from '../../components/shared/LoadingScreen.jsx';

export default function DashboardOverview() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.organization_id) return;
    async function load() {
      const orgId = profile.organization_id;
      const [batchesRes, balanceRes, txRes] = await Promise.all([
        supabase.from('survey_batches').select('id, name, status, credits_allocated, credits_used, created_at')
          .eq('organization_id', orgId).order('created_at', { ascending: false }).limit(5),
        supabase.from('users').select('credit_balance').eq('id', profile.id).single(),
        supabase.from('credit_transactions').select('id').eq('organization_id', orgId),
      ]);
      setStats({
        batches: batchesRes.data || [],
        balance: balanceRes.data?.credit_balance || 0,
        totalTx: txRes.data?.length || 0,
      });
      setLoading(false);
    }
    load();
  }, [profile]);

  if (loading || !stats) return <LoadingScreen />;

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">{t('dashboard.title')}</h1>
      <p className="mt-1 text-sm text-ansaka-muted">{profile?.organizations?.name}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-ansaka-muted">{t('credits.balance')}</p>
          <p className="mt-2 text-3xl font-semibold text-ansaka-gold-dark">{stats.balance}</p>
          <Link to="/dashboard/credits" className="mt-2 inline-block text-xs font-medium text-ansaka-gold hover:underline">
            {t('credits.buyCredits')} →
          </Link>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-ansaka-muted">Active Batches</p>
          <p className="mt-2 text-3xl font-semibold text-ansaka-ink">
            {stats.batches.filter((b) => b.status === 'active').length}
          </p>
          <Link to="/dashboard/batches" className="mt-2 inline-block text-xs font-medium text-ansaka-gold hover:underline">
            {t('nav.batches')} →
          </Link>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-ansaka-muted">Transactions</p>
          <p className="mt-2 text-3xl font-semibold text-ansaka-ink">{stats.totalTx}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-ansaka-ink">Recent Batches</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium text-ansaka-muted">Name</th>
                <th className="px-4 py-2 font-medium text-ansaka-muted">Status</th>
                <th className="px-4 py-2 font-medium text-ansaka-muted">Used / Allocated</th>
                <th className="px-4 py-2 font-medium text-ansaka-muted">Created</th>
              </tr>
            </thead>
            <tbody>
              {stats.batches.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-ansaka-muted">No batches yet</td></tr>
              ) : stats.batches.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="px-4 py-2"><Link to={`/dashboard/batch/${b.id}`} className="text-ansaka-gold hover:underline">{b.name || b.id.slice(0, 8)}</Link></td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      b.status === 'active' ? 'bg-green-100 text-green-700' :
                      b.status === 'closed' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{b.credits_used} / {b.credits_allocated}</td>
                  <td className="px-4 py-2 text-ansaka-muted">{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
