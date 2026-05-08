import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { supabase } from '../../lib/supabase.js';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function Credits() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    async function load() {
      const [pkgRes, txRes, tierRes] = await Promise.all([
        supabase.from('credit_packages').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('credit_transactions').select('*').eq('organization_id', profile?.organization_id).order('created_at', { ascending: false }).limit(20),
        supabase.from('pricing_tiers').select('*').eq('is_active', true).order('sort_order'),
      ]);
      setPackages(pkgRes.data || []);
      setTransactions(txRes.data || []);
      setTiers(tierRes.data || []);
    }
    if (profile?.organization_id) load();
  }, [profile]);

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">{t('credits.title')}</h1>

      <div className="card mt-4">
        <p className="text-xs uppercase tracking-wider text-ansaka-muted">{t('credits.balance')}</p>
        <p className="mt-2 text-4xl font-semibold text-ansaka-gold-dark">{profile?.credit_balance ?? 0}</p>
      </div>

      {tiers.length > 0 && (
        <div className="mt-6">
          <h2 className="font-serif text-xl font-semibold text-ansaka-ink">Pricing Tiers</h2>
          <div className="mt-2 space-y-2">
            {tiers.map((tier) => (
              <div key={tier.id} className="rounded-md border border-gray-200 bg-white p-3 text-sm">
                <p className="font-medium">{tier.name}</p>
                <p className="text-xs text-ansaka-muted">
                  Link {tier.min_links_inclusive}–{tier.max_links_inclusive ?? '∞'}: {tier.price_per_link_idr === 0 ? 'GRATIS' : `${formatIDR(tier.price_per_link_idr)} / link`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-ansaka-ink">{t('credits.buyCredits')}</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <div key={p.id} className="card">
              <p className="font-serif text-lg font-semibold">{p.name}</p>
              <p className="mt-1 text-3xl font-bold text-ansaka-gold-dark">{p.credits}</p>
              <p className="text-xs text-ansaka-muted">credits</p>
              <p className="mt-3 text-sm text-ansaka-muted">{p.description}</p>
              <p className="mt-3 text-base font-semibold text-ansaka-ink">{formatIDR(p.price_idr)}</p>
              <button className="btn-primary mt-3 w-full" onClick={() => alert('Payment integration: Phase 5')}>
                {t('credits.buy')}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-ansaka-ink">{t('credits.history')}</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium text-ansaka-muted">Date</th>
                <th className="px-4 py-2 font-medium text-ansaka-muted">Type</th>
                <th className="px-4 py-2 font-medium text-ansaka-muted">Amount</th>
                <th className="px-4 py-2 font-medium text-ansaka-muted">Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-ansaka-muted">No transactions yet</td></tr>
              ) : transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-ansaka-muted">{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{tx.type}</td>
                  <td className={`px-4 py-2 font-medium ${tx.amount > 0 ? 'text-status-strong' : 'text-status-critical'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </td>
                  <td className="px-4 py-2 text-ansaka-muted">{tx.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
