import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { supabase } from '../../lib/supabase.js';

export default function Batches() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [batches, setBatches] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(20);
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await supabase
      .from('survey_batches')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false });
    setBatches(data || []);
  }

  useEffect(() => {
    if (profile?.organization_id) load();
  }, [profile]);

  async function createBatch(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('survey_batches').insert({
      organization_id: profile.organization_id,
      name,
      credits_allocated: credits,
      status: 'active',
      created_by: profile.id,
    });
    setLoading(false);
    if (error) return alert(error.message);
    setShowCreate(false);
    setName('');
    setCredits(20);
    load();
  }

  function copyLink(token) {
    const url = `${window.location.origin}/survey/${token}`;
    navigator.clipboard.writeText(url);
    alert('Link copied!');
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">{t('nav.batches')}</h1>
        <button onClick={() => setShowCreate((s) => !s)} className="btn-primary">
          + {t('common.create')}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={createBatch} className="card mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium">Batch Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="input-field mt-1" placeholder="Q2 2026 Assessment" />
          </div>
          <div>
            <label className="block text-sm font-medium">Credits Allocated</label>
            <input type="number" min={1} value={credits} onChange={(e) => setCredits(Number(e.target.value))} required className="input-field mt-1" />
          </div>
          <button disabled={loading} className="btn-primary">{loading ? '...' : t('common.create')}</button>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Name</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Status</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Used / Allocated</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Link</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium">
                  <Link to={`/dashboard/batch/${b.id}`} className="text-ansaka-gold hover:underline">
                    {b.name || b.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-2">{b.status}</td>
                <td className="px-4 py-2">{b.credits_used} / {b.credits_allocated}</td>
                <td className="px-4 py-2">
                  <button onClick={() => copyLink(b.unique_link_token)} className="text-xs text-ansaka-gold hover:underline">
                    Copy survey link
                  </button>
                </td>
                <td className="px-4 py-2">
                  <Link to={`/dashboard/batch/${b.id}`} className="text-xs text-ansaka-muted hover:text-ansaka-gold">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
