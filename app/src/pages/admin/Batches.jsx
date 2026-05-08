import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';

export default function AdminBatches() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    supabase
      .from('survey_batches')
      .select('*, organizations(name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setBatches(data || []));
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">All Survey Batches</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Batch</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Organization</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Status</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Used / Allocated</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{b.name || b.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{b.organizations?.name || '—'}</td>
                <td className="px-4 py-2">{b.status}</td>
                <td className="px-4 py-2">{b.credits_used} / {b.credits_allocated}</td>
                <td className="px-4 py-2">
                  <Link to={`/dashboard/batch/${b.id}`} className="text-xs text-ansaka-gold hover:underline">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
