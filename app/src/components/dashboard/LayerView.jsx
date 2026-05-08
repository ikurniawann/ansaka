import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LAYERS } from '../../lib/fpGapMap.js';
import { getScoreStatus } from '../../lib/scoring.js';

const COLORS = {
  critical: '#DC2626',
  weak: '#EA580C',
  stable: '#CA8A04',
  strong: '#16A34A',
};

export default function LayerView({ layerScores }) {
  const { t, i18n } = useTranslation();

  const data = LAYERS.map((layer) => {
    const score = layerScores[layer.id];
    const status = getScoreStatus(score);
    return {
      key: layer.id,
      name: i18n.language === 'id' ? layer.label_id : layer.label_en,
      score: score || 0,
      color: COLORS[status?.key] || '#9CA3AF',
    };
  });

  return (
    <section className="card">
      <div className="mb-4">
        <h2 className="font-serif text-xl font-semibold text-ansaka-ink">
          {t('dashboard.layerView')}
        </h2>
        <p className="mt-1 text-sm text-ansaka-muted">
          {i18n.language === 'id' ? 'Di level mana sumbatan kinerja terjadi' : 'Where performance bottlenecks live'}
        </p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 20, bottom: 30 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
            <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v) => [v?.toFixed(2), 'Score']}
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
