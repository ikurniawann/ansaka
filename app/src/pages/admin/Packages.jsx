import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const { data } = await supabase.from('credit_packages').select('*').order('sort_order');
    setPackages(data || []);
  }
  useEffect(() => { load(); }, []);

  async function save(pkg) {
    const payload = { ...pkg };
    delete payload.id;
    if (pkg.id) {
      await supabase.from('credit_packages').update(payload).eq('id', pkg.id);
    } else {
      await supabase.from('credit_packages').insert(payload);
    }
    setEditing(null);
    load();
  }
  async function remove(id) {
    if (!confirm('Delete this package?')) return;
    await supabase.from('credit_packages').delete().eq('id', id);
    load();
  }

  function Form({ pkg, onSave, onCancel }) {
    const [f, setF] = useState(pkg);
    return (
      <div className="card mt-4 space-y-3">
        <input className="input-field" placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className="input-field" type="number" placeholder="Credits" value={f.credits} onChange={(e) => setF({ ...f, credits: Number(e.target.value) })} />
        <input className="input-field" type="number" placeholder="Price (IDR)" value={f.price_idr} onChange={(e) => setF({ ...f, price_idr: Number(e.target.value) })} />
        <textarea className="input-field" rows={2} placeholder="Description" value={f.description || ''} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <input className="input-field" type="number" placeholder="Sort order" value={f.sort_order || 0} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} />
          Active
        </label>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => onSave(f)}>Save</button>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">Credit Packages</h1>
        <button className="btn-primary" onClick={() => setEditing({ name: '', credits: 20, price_idr: 0, is_active: true, sort_order: 99 })}>
          + New Package
        </button>
      </div>

      {editing && <Form pkg={editing} onSave={save} onCancel={() => setEditing(null)} />}

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Name</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Credits</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Price</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2">{p.credits}</td>
                <td className="px-4 py-2">{formatIDR(p.price_idr)}</td>
                <td className="px-4 py-2">{p.is_active ? '✓' : '—'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => setEditing(p)} className="text-xs text-ansaka-gold hover:underline">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-xs text-status-critical hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
