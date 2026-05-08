import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase.js';

export default function Insight() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    supabase
      .from('cms_blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => setPosts(data || []));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-serif text-4xl font-semibold text-ansaka-ink">{t('nav.insight')}</h1>
      <p className="mt-3 text-ansaka-muted">
        Riset, whitepaper, dan thought leadership tentang Organizational Alignment.
      </p>

      <div className="mt-10 space-y-6">
        {posts.length === 0 ? (
          <p className="text-sm text-ansaka-muted">Belum ada artikel.</p>
        ) : (
          posts.map((p) => (
            <article key={p.id} className="card">
              <p className="text-xs uppercase tracking-wider text-ansaka-muted">
                {p.published_at && new Date(p.published_at).toLocaleDateString()}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-ansaka-ink">
                {i18n.language === 'id' ? p.title_id : (p.title_en || p.title_id)}
              </h2>
              <p className="mt-2 text-sm text-ansaka-ink">
                {i18n.language === 'id' ? p.excerpt_id : (p.excerpt_en || p.excerpt_id)}
              </p>
              {p.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-ansaka-gold/10 px-2 py-0.5 text-xs text-ansaka-gold-dark">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
