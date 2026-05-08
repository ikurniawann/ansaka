import { useTranslation } from 'react-i18next';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { DRIVERS } from '../../lib/fpGapMap.js';
import { getOrgProfile } from '../../lib/scoring.js';
import ScoreChip from '../shared/ScoreChip.jsx';
import MaturityBadge from '../shared/MaturityBadge.jsx';

export default function ExecutiveSummary({ overall, driverScores }) {
  const { t, i18n } = useTranslation();

  const radarData = DRIVERS.map((d) => ({
    driver: d.id,
    fullName: t(`drivers.${d.id}`),
    score: driverScores[d.id] || 0,
  }));

  const profile = getOrgProfile(driverScores, i18n.language);

  return (
    <section className="card">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ansaka-ink">
            {t('dashboard.executiveSummary')}
          </h2>
          {profile && (
            <p className="mt-1 text-sm text-ansaka-gold-dark italic">"{profile}"</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-ansaka-muted">{t('dashboard.overall')}</p>
          <div className="mt-1 text-4xl font-semibold text-ansaka-ink">
            {overall != null ? overall.toFixed(2) : '—'}
            <span className="ml-1 text-sm font-normal text-ansaka-muted">/ 4.00</span>
          </div>
          <ScoreChip score={overall} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="driver" tick={{ fontSize: 11, fill: '#6B6B6B' }} />
              <PolarRadiusAxis domain={[0, 4]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#B8923B" fill="#B8923B" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          <MaturityBadge score={overall} />
          <div className="grid grid-cols-2 gap-2 text-sm">
            {DRIVERS.map((d) => (
              <div key={d.id} className="flex items-center justify-between border-b border-gray-100 py-1.5">
                <span className="text-xs text-ansaka-muted">{d.id}</span>
                <ScoreChip score={driverScores[d.id]} showLevel={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
