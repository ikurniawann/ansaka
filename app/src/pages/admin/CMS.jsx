import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';

export default function AdminCMS() {
  const [tab, setTab] = useState('pages');
  const [pages, setPages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const [p, b] = await Promise.all([
      supabase.from('cms_pages').select('*').order('slug'),
      supabase.from('cms_blog_posts').select('*').order('created_at', { ascending: false }),
    ]);
    setPages(p.data || []);
    setPosts(b.data || []);
  }
  useEffect(() => { load(); }, []);

  async function savePage(p) {
    const payload = { ...p };
    delete payload.id;
    if (p.id) {
      await supabase.from('cms_pages').update(payload).eq('id', p.id);
    } else {
      await supabase.from('cms_pages').insert(payload);
    }
    setEditing(null);
    load();
  }

  async function savePost(p) {
    const payload = { ...p };
    delete payload.id;
    if (typeof payload.tags === 'string') payload.tags = payload.tags.split(',').map((s) => s.trim()).filter(Boolean);
    if (p.id) {
      await supabase.from('cms_blog_posts').update(payload).eq('id', p.id);
    } else {
      await supabase.from('cms_blog_posts').insert(payload);
    }
    setEditing(null);
    load();
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">Content Management</h1>

      <div className="mt-4 flex gap-2 border-b border-gray-200">
        {['pages', 'posts'].map((t) => (
          <button key={t} onClick={() => { setTab(t); setEditing(null); }} className={`px-4 py-2 text-sm font-medium ${tab === t ? 'border-b-2 border-ansaka-gold text-ansaka-gold-dark' : 'text-ansaka-muted'}`}>
            {t === 'pages' ? 'Pages' : 'Blog Posts'}
          </button>
        ))}
      </div>

      {tab === 'pages' && (
        <div className="mt-4">
          {!editing && (
            <>
              <div className="flex justify-end">
                <button className="btn-primary" onClick={() => setEditing({ kind: 'page', slug: '', title_id: '', title_en: '', content_id: { sections: [] }, content_en: { sections: [] }, is_published: true })}>+ New Page</button>
              </div>
              <div className="mt-4 space-y-2">
                {pages.map((p) => (
                  <div key={p.id} className="card flex items-center justify-between">
                    <div>
                      <p className="font-semibold">/{p.slug}</p>
                      <p className="text-sm text-ansaka-muted">ID: {p.title_id} | EN: {p.title_en}</p>
                    </div>
                    <button onClick={() => setEditing({ ...p, kind: 'page' })} className="text-xs text-ansaka-gold hover:underline">Edit</button>
                  </div>
                ))}
              </div>
            </>
          )}
          {editing?.kind === 'page' && <PageForm page={editing} onSave={savePage} onCancel={() => setEditing(null)} />}
        </div>
      )}

      {tab === 'posts' && (
        <div className="mt-4">
          {!editing && (
            <>
              <div className="flex justify-end">
                <button className="btn-primary" onClick={() => setEditing({ kind: 'post', slug: '', title_id: '', title_en: '', body_id: '', body_en: '', tags: [], is_published: false })}>+ New Post</button>
              </div>
              <div className="mt-4 space-y-2">
                {posts.map((p) => (
                  <div key={p.id} className="card flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{p.title_id}</p>
                      <p className="text-sm text-ansaka-muted">/{p.slug} {p.is_published ? '· Published' : '· Draft'}</p>
                    </div>
                    <button onClick={() => setEditing({ ...p, kind: 'post' })} className="text-xs text-ansaka-gold hover:underline">Edit</button>
                  </div>
                ))}
              </div>
            </>
          )}
          {editing?.kind === 'post' && <PostForm post={editing} onSave={savePost} onCancel={() => setEditing(null)} />}
        </div>
      )}
    </div>
  );
}

function PageForm({ page, onSave, onCancel }) {
  const [f, setF] = useState(page);
  return (
    <div className="card mt-4 space-y-3">
      <input className="input-field" placeholder="Slug (e.g. home)" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} />
      <input className="input-field" placeholder="Title ID" value={f.title_id} onChange={(e) => setF({ ...f, title_id: e.target.value })} />
      <input className="input-field" placeholder="Title EN" value={f.title_en} onChange={(e) => setF({ ...f, title_en: e.target.value })} />
      <textarea className="input-field" rows={3} placeholder="Meta description ID" value={f.meta_description_id || ''} onChange={(e) => setF({ ...f, meta_description_id: e.target.value })} />
      <textarea className="input-field" rows={3} placeholder="Meta description EN" value={f.meta_description_en || ''} onChange={(e) => setF({ ...f, meta_description_en: e.target.value })} />
      <textarea className="input-field font-mono text-xs" rows={6} placeholder="Content ID (JSON)" value={JSON.stringify(f.content_id || { sections: [] }, null, 2)} onChange={(e) => { try { setF({ ...f, content_id: JSON.parse(e.target.value) }); } catch {} }} />
      <textarea className="input-field font-mono text-xs" rows={6} placeholder="Content EN (JSON)" value={JSON.stringify(f.content_en || { sections: [] }, null, 2)} onChange={(e) => { try { setF({ ...f, content_en: JSON.parse(e.target.value) }); } catch {} }} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={f.is_published} onChange={(e) => setF({ ...f, is_published: e.target.checked })} /> Published
      </label>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => onSave(f)}>Save</button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function PostForm({ post, onSave, onCancel }) {
  const [f, setF] = useState({ ...post, tagsString: Array.isArray(post.tags) ? post.tags.join(', ') : '' });
  return (
    <div className="card mt-4 space-y-3">
      <input className="input-field" placeholder="Slug" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} />
      <input className="input-field" placeholder="Title ID" value={f.title_id} onChange={(e) => setF({ ...f, title_id: e.target.value })} />
      <input className="input-field" placeholder="Title EN" value={f.title_en || ''} onChange={(e) => setF({ ...f, title_en: e.target.value })} />
      <textarea className="input-field" rows={2} placeholder="Excerpt ID" value={f.excerpt_id || ''} onChange={(e) => setF({ ...f, excerpt_id: e.target.value })} />
      <textarea className="input-field" rows={2} placeholder="Excerpt EN" value={f.excerpt_en || ''} onChange={(e) => setF({ ...f, excerpt_en: e.target.value })} />
      <textarea className="input-field" rows={8} placeholder="Body ID (markdown)" value={f.body_id || ''} onChange={(e) => setF({ ...f, body_id: e.target.value })} />
      <textarea className="input-field" rows={8} placeholder="Body EN (markdown)" value={f.body_en || ''} onChange={(e) => setF({ ...f, body_en: e.target.value })} />
      <input className="input-field" placeholder="Cover image URL" value={f.cover_image_url || ''} onChange={(e) => setF({ ...f, cover_image_url: e.target.value })} />
      <input className="input-field" placeholder="Tags (comma separated)" value={f.tagsString} onChange={(e) => setF({ ...f, tagsString: e.target.value, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={f.is_published} onChange={(e) => setF({ ...f, is_published: e.target.checked, published_at: e.target.checked ? new Date().toISOString() : null })} /> Published
      </label>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => { const out = { ...f }; delete out.tagsString; onSave(out); }}>Save</button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
