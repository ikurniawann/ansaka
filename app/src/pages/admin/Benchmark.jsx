import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { DRIVERS } from '../../lib/fpGapMap.js';

export default function AdminBenchmark() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const { data } = await supabase.from('industry_benchmarks').select('*').order('industry').order('driver_id');
    setRows(data || []);
  }
  useEffect(() => { load(); }, []);

  async function save(b) {
    const payload = { ...b };
    delete payload.id;
    if (b.id) {
      await supabase.from('industry_benchmarks').update(payload).eq('id', b.id);
    } else {
      await supabase.from('industry_benchmarks').insert(payload);
    }
    setEditing(null);
    load();
  }
  async function remove(id) {
    if (!confirm('Delete?')) return;
    await supabase.from('industry_benchmarks').delete().eq('id', id);
    load();
  }

  function Form({ row, onSave, onCancel }) {
    const [f, setF] = useState(row);
    return (
      <div className="card mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs">Industry</label>
          <input className="input-field mt-1" value={f.industry} onChange={(e) => setF({ ...f, industry: e.target.value })} />
        </div>
        <div>
          <label className="text-xs">Size Range</label>
          <input className="input-field mt-1" value={f.size_range || ''} onChange={(e) => setF({ ...f, size_range: e.target.value })} />
        </div>
        <div>
          <label className="text-xs">Driver</label>
          <select className="input-field mt-1" value={f.driver_id} onChange={(e) => setF({ ...f, driver_id: e.target.value })}>
            <option value="">—</option>
            {DRIVERS.map((d) => <option key={d.id} value={d.id}>{d.id} — {d.name_id}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs">Benchmark Score</label>
          <input className="input-field mt-1" type="number" step={0.01} value={f.benchmark_score} onChange={(e) => setF({ ...f, benchmark_score: Number(e.target.value) })} />
        </div>
        <div className="col-span-2 flex gap-2">
          <button className="btn-primary" onClick={() => onSave(f)}>Save</button>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">Industry Benchmarks</h1>
        <button className="btn-primary" onClick={() => setEditing({ industry: '', size_range: '', driver_id: 'D1', benchmark_score: 3.0, is_active: true })}>
          + Add Benchmark
        </button>
      </div>

      {editing && <Form row={editing} onSave={save} onCancel={() => setEditing(null)} />}

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Industry</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Size</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Driver</th>
              <th className="px-4 py-2 font-medium text-ansaka-muted">Score</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{r.industry}</td>
                <td className="px-4 py-2">{r.size_range || '—'}</td>
                <td className="px-4 py-2">{r.driver_id}</td>
                <td className="px-4 py-2 font-medium">{r.benchmark_score}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => setEditing(r)} className="text-xs text-ansaka-gold hover:underline">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-xs text-status-critical hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
