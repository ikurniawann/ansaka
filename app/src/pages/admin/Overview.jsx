import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';

export default function AdminOverview() {
  const [stats, setStats] = useState({ orgs: 0, batches: 0, responses: 0, revenue: 0 });

  useEffect(() => {
    async function load() {
      const [orgs, batches, responses, tx] = await Promise.all([
        supabase.from('organizations').select('id', { count: 'exact', head: true }),
        supabase.from('survey_batches').select('id', { count: 'exact', head: true }),
        supabase.from('survey_responses').select('id', { count: 'exact', head: true }),
        supabase.from('credit_transactions').select('amount').eq('type', 'purchase'),
      ]);
      const revenue = (tx.data || []).reduce((sum, r) => sum + (r.amount || 0), 0);
      setStats({
        orgs: orgs.count || 0,
        batches: batches.count || 0,
        responses: responses.count || 0,
        revenue,
      });
    }
    load();
  }, []);

  const cards = [
    { label: 'Organizations', value: stats.orgs, link: '/admin/organizations' },
    { label: 'Survey Batches', value: stats.batches, link: '/admin/batches' },
    { label: 'Total Responses', value: stats.responses, link: null },
    { label: 'Total Credits Sold', value: stats.revenue, link: '/admin/credits' },
  ];

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">Super Admin Overview</h1>
      <p className="mt-1 text-sm text-ansaka-muted">Platform-wide statistics & quick actions</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <p className="text-xs uppercase tracking-wider text-ansaka-muted">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold text-ansaka-ink">{c.value}</p>
            {c.link && (
              <Link to={c.link} className="mt-2 inline-block text-xs font-medium text-ansaka-gold hover:underline">
                View →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/admin/formulas" className="card hover:border-ansaka-gold">
          <h3 className="font-serif text-lg font-semibold">OAM Formula Editor</h3>
          <p className="mt-1 text-sm text-ansaka-muted">Adjust Q→FP weights, status thresholds, gap mapping</p>
        </Link>
        <Link to="/admin/pricing" className="card hover:border-ansaka-gold">
          <h3 className="font-serif text-lg font-semibold">Pricing Tier Editor</h3>
          <p className="mt-1 text-sm text-ansaka-muted">Configure free + paid tiers per link</p>
        </Link>
        <Link to="/admin/cms" className="card hover:border-ansaka-gold">
          <h3 className="font-serif text-lg font-semibold">Content Management</h3>
          <p className="mt-1 text-sm text-ansaka-muted">Marketing pages, blog posts, SEO meta</p>
        </Link>
        <Link to="/admin/benchmark" className="card hover:border-ansaka-gold">
          <h3 className="font-serif text-lg font-semibold">Industry Benchmarks</h3>
          <p className="mt-1 text-sm text-ansaka-muted">Reference scores for dashboard comparison</p>
        </Link>
      </div>
    </div>
  );
}
