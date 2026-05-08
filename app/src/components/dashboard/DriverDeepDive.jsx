import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DRIVERS, FP_BY_ID } from '../../lib/fpGapMap.js';
import { getTop3WeakestFPs, getScoreStatus } from '../../lib/scoring.js';
import ScoreChip from '../shared/ScoreChip.jsx';

export default function DriverDeepDive({ driverScores, fpScores }) {
  const { t, i18n } = useTranslation();
  const [selectedDriver, setSelectedDriver] = useState(null);

  const top3 = selectedDriver ? getTop3WeakestFPs(selectedDriver, fpScores) : [];

  return (
    <section className="card">
      <div className="mb-4">
        <h2 className="font-serif text-xl font-semibold text-ansaka-ink">
          {t('dashboard.driverDeepDive')}
        </h2>
        <p className="mt-1 text-sm text-ansaka-muted">
          {i18n.language === 'id'
            ? 'Klik driver untuk melihat 3 Failure Points terlemah'
            : 'Click a driver to see top 3 weakest Failure Points'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {DRIVERS.map((d) => {
          const score = driverScores[d.id];
          const status = getScoreStatus(score);
          const isSelected = selectedDriver === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDriver(isSelected ? null : d.id)}
              className={`rounded-md border p-2 text-center transition-all ${
                isSelected ? 'border-ansaka-gold bg-ansaka-gold/10' : 'border-gray-200 hover:border-ansaka-gold/50'
              }`}
            >
              <p className="text-xs font-semibold text-ansaka-ink">{d.id}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-ansaka-muted line-clamp-2">
                {t(`drivers.${d.id}`)}
              </p>
              <p className={`mt-1 text-sm font-semibold ${
                status?.key === 'critical' ? 'text-status-critical' :
                status?.key === 'weak' ? 'text-status-weak' :
                status?.key === 'stable' ? 'text-status-stable' : 'text-status-strong'
              }`}>
                {score?.toFixed(2) || '—'}
              </p>
            </button>
          );
        })}
      </div>

      {selectedDriver && top3.length > 0 && (
        <div className="mt-6 rounded-lg bg-ansaka-paper p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ansaka-gold">
            {selectedDriver} — {t(`drivers.${selectedDriver}`)} · 3 Weakest FPs
          </p>
          <div className="space-y-2">
            {top3.map((fp) => {
              const meta = FP_BY_ID[fp.id];
              return (
                <div key={fp.id} className="flex items-center justify-between rounded-md bg-white p-3">
                  <div>
                    <p className="text-xs font-semibold text-ansaka-ink">{fp.id}</p>
                    <p className="text-sm text-ansaka-ink">
                      {i18n.language === 'id' ? meta?.label_id : meta?.label_en}
                    </p>
                  </div>
                  <ScoreChip score={fp.score} />
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs italic text-ansaka-muted">
            {i18n.language === 'id'
              ? 'Hanya 3 FP terendah ditampilkan. Analisis lengkap eksklusif untuk konsultan.'
              : 'Only top 3 weakest FPs shown. Full analysis is exclusive to the consultant.'}
          </p>
        </div>
      )}
    </section>
  );
}
