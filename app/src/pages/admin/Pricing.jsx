import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function AdminPricing() {
  const [tiers, setTiers] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const { data } = await supabase.from('pricing_tiers').select('*').order('sort_order');
    setTiers(data || []);
  }
  useEffect(() => { load(); }, []);

  async function save(tier) {
    const payload = { ...tier };
    delete payload.id;
    if (tier.id) {
      await supabase.from('pricing_tiers').update(payload).eq('id', tier.id);
    } else {
      await supabase.from('pricing_tiers').insert(payload);
    }
    setEditing(null);
    load();
  }
  async function remove(id) {
    if (!confirm('Delete this tier?')) return;
    await supabase.from('pricing_tiers').delete().eq('id', id);
    load();
  }

  function Form({ tier, onSave, onCancel }) {
    const [f, setF] = useState({
      ...tier,
      max_links_inclusive: tier.max_links_inclusive ?? '',
    });
    return (
      <div className="card mt-4 space-y-3">
        <h3 className="font-serif text-lg font-semibold">{tier.id ? 'Edit Tier' : 'New Tier'}</h3>
        <div>
          <label className="block text-sm font-medium">Tier Name</label>
          <input className="input-field mt-1" placeholder="e.g., Free Tier" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea className="input-field mt-1" rows={2} value={f.description || ''} onChange={(e) => setF({ ...f, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Min Links (inclusive)</label>
            <input className="input-field mt-1" type="number" min={0} value={f.min_links_inclusive} onChange={(e) => setF({ ...f, min_links_inclusive: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-sm font-medium">Max Links (inclusive, blank = ∞)</label>
            <input className="input-field mt-1" type="number" min={0} value={f.max_links_inclusive} onChange={(e) => setF({ ...f, max_links_inclusive: e.target.value === '' ? null : Number(e.target.value) })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Price per Link (IDR, 0 = gratis)</label>
          <input className="input-field mt-1" type="number" min={0} value={f.price_per_link_idr} onChange={(e) => setF({ ...f, price_per_link_idr: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Sort Order</label>
          <input className="input-field mt-1" type="number" value={f.sort_order || 0} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} />
          Active
        </label>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => onSave({ ...f, max_links_inclusive: f.max_links_inclusive === '' ? null : f.max_links_inclusive })}>Save</button>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">Pricing Tiers</h1>
        <button className="btn-primary" onClick={() => setEditing({ name: '', description: '', min_links_inclusive: 0, max_links_inclusive: null, price_per_link_idr: 0, is_active: true, sort_order: 99 })}>
          + New Tier
        </button>
      </div>
      <p className="mt-2 text-sm text-ansaka-muted max-w-2xl">
        Definisikan skema harga fleksibel. Contoh: tier 1 (link 0–30, gratis) + tier 2 (link 31+, Rp 100,000/link).
        Sistem akan apply tier sesuai posisi link dalam sequence.
      </p>

      {editing && <Form tier={editing} onSave={save} onCancel={() => setEditing(null)} />}

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Tier</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Range (Links)</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Price/Link</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="px-4 py-2">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-ansaka-muted">{t.description}</p>
                </td>
                <td className="px-4 py-2">{t.min_links_inclusive}–{t.max_links_inclusive ?? '∞'}</td>
                <td className="px-4 py-2 font-medium">
                  {t.price_per_link_idr === 0 ? <span className="text-status-strong">GRATIS</span> : formatIDR(t.price_per_link_idr)}
                </td>
                <td className="px-4 py-2">{t.is_active ? '✓' : '—'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => setEditing(t)} className="text-xs text-ansaka-gold hover:underline">Edit</button>
                  <button onClick={() => remove(t.id)} className="text-xs text-status-critical hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
