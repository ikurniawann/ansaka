import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { DRIVERS, FAILURE_POINTS } from '../../lib/fpGapMap.js';
import { WEIGHT_MAP, QUESTIONS_PER_DRIVER } from '../../lib/weightMap.js';

export default function AdminFormulas() {
  const [formulas, setFormulas] = useState([]);
  const [active, setActive] = useState(null);
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'editor'

  async function load() {
    const { data } = await supabase.from('oam_formulas').select('*').order('created_at', { ascending: false });
    setFormulas(data || []);
    setActive(data?.find((f) => f.is_active) || null);
  }
  useEffect(() => { load(); }, []);

  async function activate(id) {
    await supabase.from('oam_formulas').update({ is_active: false }).neq('id', id);
    await supabase.from('oam_formulas').update({ is_active: true }).eq('id', id);
    load();
  }

  async function saveFormula(formula) {
    const payload = { ...formula };
    delete payload.id;
    if (formula.id) {
      await supabase.from('oam_formulas').update(payload).eq('id', formula.id);
    } else {
      await supabase.from('oam_formulas').insert(payload);
    }
    setEditing(null);
    setView('list');
    load();
  }

  function newFormula() {
    return {
      version: `oam12-v${formulas.length + 2}`,
      description: 'Custom formula',
      weight_map: WEIGHT_MAP,
      status_thresholds: [
        { min: 1.0, max: 2.0, level: 'Critical', key: 'critical' },
        { min: 2.0, max: 2.8, level: 'Weak', key: 'weak' },
        { min: 2.8, max: 3.5, level: 'Stable', key: 'stable' },
        { min: 3.5, max: 4.01, level: 'Strong', key: 'strong' },
      ],
      is_active: false,
      notes: '',
    };
  }

  if (view === 'editor' && editing) {
    return <FormulaEditor formula={editing} onSave={saveFormula} onCancel={() => { setEditing(null); setView('list'); }} />;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">OAM Formulas</h1>
          <p className="mt-1 text-sm text-ansaka-muted">
            Kelola Q→FP weights, status thresholds. Hanya satu formula aktif pada satu waktu.
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(newFormula()); setView('editor'); }}>
          + New Formula
        </button>
      </div>

      {active && (
        <div className="card mt-4 border-l-4 border-status-strong bg-status-strong/5">
          <p className="text-xs font-medium uppercase tracking-wider text-status-strong">Active Formula</p>
          <p className="mt-1 font-semibold">{active.version}</p>
          <p className="text-sm text-ansaka-muted">{active.description}</p>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {formulas.map((f) => (
          <div key={f.id} className="card flex items-center justify-between">
            <div>
              <p className="font-semibold">{f.version} {f.is_active && <span className="ml-2 text-xs text-status-strong">● ACTIVE</span>}</p>
              <p className="text-sm text-ansaka-muted">{f.description}</p>
              <p className="text-xs text-ansaka-muted">{new Date(f.created_at).toLocaleString()}</p>
            </div>
            <div className="space-x-2">
              {!f.is_active && (
                <button onClick={() => activate(f.id)} className="text-xs font-medium text-ansaka-gold hover:underline">
                  Activate
                </button>
              )}
              <button onClick={() => { setEditing(f); setView('editor'); }} className="text-xs text-ansaka-gold hover:underline">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormulaEditor({ formula, onSave, onCancel }) {
  const [f, setF] = useState(formula);
  const [selDriver, setSelDriver] = useState('D1');
  const [tab, setTab] = useState('weights'); // 'weights' | 'thresholds' | 'meta'

  function updateWeight(driver, qId, fpId, val) {
    const numVal = parseFloat(val);
    setF((prev) => {
      const wm = JSON.parse(JSON.stringify(prev.weight_map || {}));
      if (!wm[driver]) wm[driver] = {};
      if (!wm[driver][qId]) wm[driver][qId] = {};
      if (Number.isNaN(numVal) || numVal === 0) {
        delete wm[driver][qId][fpId];
      } else {
        wm[driver][qId][fpId] = numVal;
      }
      return { ...prev, weight_map: wm };
    });
  }

  function updateThreshold(idx, key, val) {
    setF((prev) => {
      const t = [...(prev.status_thresholds || [])];
      t[idx] = { ...t[idx], [key]: key === 'level' || key === 'key' ? val : Number(val) };
      return { ...prev, status_thresholds: t };
    });
  }

  const driverQs = QUESTIONS_PER_DRIVER[selDriver] || 0;

  return (
    <div className="p-8">
      <button onClick={onCancel} className="text-xs text-ansaka-gold hover:underline">← Back</button>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ansaka-ink">Edit OAM Formula</h1>

      <div className="card mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Version</label>
          <input className="input-field mt-1" value={f.version} onChange={(e) => setF({ ...f, version: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input className="input-field mt-1" value={f.description || ''} onChange={(e) => setF({ ...f, description: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium">Notes</label>
          <textarea className="input-field mt-1" rows={2} value={f.notes || ''} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        </div>
        <label className="col-span-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} />
          Make active immediately on save
        </label>
      </div>

      <div className="mt-6 flex gap-2 border-b border-gray-200">
        {['weights', 'thresholds'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium ${tab === t ? 'border-b-2 border-ansaka-gold text-ansaka-gold-dark' : 'text-ansaka-muted'}`}>
            {t === 'weights' ? 'Q→FP Weights' : 'Score Thresholds'}
          </button>
        ))}
      </div>

      {tab === 'weights' && (
        <div className="mt-4">
          <div className="mb-3 flex flex-wrap gap-1">
            {DRIVERS.map((d) => (
              <button key={d.id} onClick={() => setSelDriver(d.id)}
                className={`rounded-md border px-2 py-1 text-xs ${selDriver === d.id ? 'border-ansaka-gold bg-ansaka-gold text-white' : 'border-gray-300'}`}>
                {d.id}
              </button>
            ))}
          </div>
          <p className="text-sm text-ansaka-muted">Driver: <strong>{selDriver}</strong> · {driverQs} pertanyaan Likert</p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-ansaka-muted">Q</th>
                  {FAILURE_POINTS.map((fp) => (
                    <th key={fp.id} className="px-2 py-2 text-center font-medium text-ansaka-muted" title={fp.label_id}>
                      {fp.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: driverQs }, (_, i) => {
                  const qId = `Q${i + 1}`;
                  const qWeights = f.weight_map?.[selDriver]?.[qId] || {};
                  return (
                    <tr key={qId} className="border-t border-gray-100">
                      <td className="px-3 py-1.5 font-medium">{qId}</td>
                      {FAILURE_POINTS.map((fp) => (
                        <td key={fp.id} className="px-1 py-1 text-center">
                          <input
                            type="number"
                            step={0.05}
                            min={0}
                            max={1}
                            value={qWeights[fp.id] || ''}
                            onChange={(e) => updateWeight(selDriver, qId, fp.id, e.target.value)}
                            className="w-12 rounded border border-gray-200 px-1 py-0.5 text-center text-xs focus:border-ansaka-gold focus:outline-none"
                            placeholder="—"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ansaka-muted">
            Tip: jumlah weight per Q sebaiknya ≈ 1.0. Kosongkan untuk hapus mapping FP.
          </p>
        </div>
      )}

      {tab === 'thresholds' && (
        <div className="mt-4 space-y-2">
          {(f.status_thresholds || []).map((t, idx) => (
            <div key={idx} className="card grid grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-ansaka-muted">Level</label>
                <input className="input-field mt-1" value={t.level} onChange={(e) => updateThreshold(idx, 'level', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-ansaka-muted">Key</label>
                <input className="input-field mt-1" value={t.key} onChange={(e) => updateThreshold(idx, 'key', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-ansaka-muted">Min</label>
                <input className="input-field mt-1" type="number" step={0.1} value={t.min} onChange={(e) => updateThreshold(idx, 'min', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-ansaka-muted">Max</label>
                <input className="input-field mt-1" type="number" step={0.1} value={t.max} onChange={(e) => updateThreshold(idx, 'max', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button className="btn-primary" onClick={() => onSave(f)}>Save Formula</button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
