import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';

export default function AdminOrganizations() {
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    supabase.from('organizations').select('*').order('created_at', { ascending: false }).then(({ data }) => setOrgs(data || []));
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">Organizations</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Name</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Industry</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Size</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Country</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Created</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((o) => (
              <tr key={o.id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium">{o.name}</td>
                <td className="px-4 py-2">{o.industry || '—'}</td>
                <td className="px-4 py-2">{o.size_range || '—'}</td>
                <td className="px-4 py-2">{o.country}</td>
                <td className="px-4 py-2 text-ansaka-muted">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
