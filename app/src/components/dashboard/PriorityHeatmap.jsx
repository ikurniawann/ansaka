import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { sortDriversByPriority, getScoreStatus } from '../../lib/scoring.js';

const COLORS = {
  critical: '#DC2626',
  weak: '#EA580C',
  stable: '#CA8A04',
  strong: '#16A34A',
};

export default function PriorityHeatmap({ driverScores }) {
  const { t } = useTranslation();
  const sorted = sortDriversByPriority(driverScores);

  const data = sorted.map((d) => {
    const status = getScoreStatus(d.score);
    return {
      driver: d.id,
      name: t(`drivers.${d.id}`),
      score: d.score,
      color: COLORS[status?.key] || '#9CA3AF',
    };
  });

  return (
    <section className="card">
      <div className="mb-4">
        <h2 className="font-serif text-xl font-semibold text-ansaka-ink">
          {t('dashboard.priorityHeatmap')}
        </h2>
        <p className="mt-1 text-sm text-ansaka-muted">{t('dashboard.topCriticalDrivers')}</p>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
            <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="driver" tick={{ fontSize: 11 }} width={50} />
            <Tooltip
              formatter={(v) => [v?.toFixed(2), 'Score']}
              labelFormatter={(d) => data.find((x) => x.driver === d)?.name}
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
