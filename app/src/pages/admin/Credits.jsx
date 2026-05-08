import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';

export default function AdminCredits() {
  const [tx, setTx] = useState([]);

  useEffect(() => {
    supabase
      .from('credit_transactions')
      .select('*, organizations(name)')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => setTx(data || []));
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">Global Credit Transactions</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Date</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Organization</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Type</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Amount</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Notes</th>
            </tr>
          </thead>
          <tbody>
            {tx.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="px-4 py-2 text-ansaka-muted">{new Date(t.created_at).toLocaleString()}</td>
                <td className="px-4 py-2">{t.organizations?.name || '—'}</td>
                <td className="px-4 py-2">{t.type}</td>
                <td className={`px-4 py-2 font-medium ${t.amount > 0 ? 'text-status-strong' : 'text-status-critical'}`}>
                  {t.amount > 0 ? '+' : ''}{t.amount}
                </td>
                <td className="px-4 py-2 text-ansaka-muted">{t.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
