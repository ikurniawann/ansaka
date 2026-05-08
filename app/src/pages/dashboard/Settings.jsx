import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { supabase } from '../../lib/supabase.js';

export default function Settings() {
  const { t } = useTranslation();
  const { profile, reloadProfile } = useAuth();
  const [form, setForm] = useState({ name: '', industry: '', size_range: '', country: 'Indonesia' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.organizations) {
      setForm({
        name: profile.organizations.name || '',
        industry: profile.organizations.industry || '',
        size_range: profile.organizations.size_range || '',
        country: profile.organizations.country || 'Indonesia',
      });
    }
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('organizations')
      .update(form)
      .eq('id', profile.organization_id);
    setSaving(false);
    if (error) return alert(error.message);
    reloadProfile();
    alert(t('common.success'));
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">{t('nav.settings')}</h1>
      <form onSubmit={handleSave} className="card mt-6 max-w-xl space-y-4">
        <h2 className="font-serif text-xl font-semibold">Organization Profile</h2>
        <div>
          <label className="block text-sm font-medium">{t('auth.organizationName')}</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('auth.industry')}</label>
          <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('auth.sizeRange')}</label>
          <input value={form.size_range} onChange={(e) => setForm({ ...form, size_range: e.target.value })} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('auth.country')}</label>
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field mt-1" />
        </div>
        <button disabled={saving} className="btn-primary">{saving ? '...' : t('common.save')}</button>
      </form>
    </div>
  );
}
