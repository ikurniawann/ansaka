import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase, MIN_RESPONDENTS } from '../../lib/supabase.js';
import { aggregateBatch } from '../../lib/scoring.js';
import LoadingScreen from '../../components/shared/LoadingScreen.jsx';
import ExecutiveSummary from '../../components/dashboard/ExecutiveSummary.jsx';
import PriorityHeatmap from '../../components/dashboard/PriorityHeatmap.jsx';
import LayerView from '../../components/dashboard/LayerView.jsx';
import DriverDeepDive from '../../components/dashboard/DriverDeepDive.jsx';
import PatternIntelligence from '../../components/dashboard/PatternIntelligence.jsx';

export default function BatchDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [batch, setBatch] = useState(null);
  const [agg, setAgg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: bData } = await supabase
        .from('survey_batches').select('*').eq('id', id).maybeSingle();
      setBatch(bData);

      // Try aggregate from batch_results first; fall back to live calc.
      const { data: results } = await supabase
        .from('batch_results').select('*').eq('batch_id', id).maybeSingle();

      if (results) {
        setAgg({
          fpScores: results.fp_scores,
          driverScores: results.driver_scores,
          layerScores: results.layer_scores,
          gapScores: results.gap_scores,
          overall: results.overall_score,
          respondentCount: results.respondent_count,
        });
      } else {
        // Live aggregate from raw responses (Super Admin only via RLS).
        const { data: responses } = await supabase
          .from('survey_responses')
          .select('fp_scores, driver_scores, layer_scores, gap_scores')
          .eq('batch_id', id)
          .eq('response_status', 'complete');
        if (responses?.length) {
          const subs = responses.map((r) => ({
            fpScores: r.fp_scores, driverScores: r.driver_scores,
            layerScores: r.layer_scores, gapScores: r.gap_scores,
          }));
          setAgg(aggregateBatch(subs));
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (!batch) {
    return <div className="p-8 text-status-critical">Batch not found.</div>;
  }

  const respondentCount = agg?.respondentCount || batch.credits_used;
  const minMet = respondentCount >= (batch.min_respondents || MIN_RESPONDENTS);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ansaka-ink">
          {batch.name || batch.id.slice(0, 8)}
        </h1>
        <p className="mt-1 text-sm text-ansaka-muted">
          {t('dashboard.respondents')}: {respondentCount} / {batch.credits_allocated} ({batch.status})
        </p>
      </div>

      {!minMet || !agg ? (
        <div className="card border-l-4 border-status-stable bg-status-stable/5">
          <h3 className="font-serif text-lg font-semibold">
            {t('dashboard.minNotMet', { min: batch.min_respondents || MIN_RESPONDENTS })}
          </h3>
          <p className="mt-2 text-sm text-ansaka-muted">
            {t('dashboard.currentRespondents', { count: respondentCount })}
          </p>
        </div>
      ) : (
        <>
          <ExecutiveSummary overall={agg.overall} driverScores={agg.driverScores} />
          <PriorityHeatmap driverScores={agg.driverScores} />
          <LayerView layerScores={agg.layerScores} />
          <DriverDeepDive driverScores={agg.driverScores} fpScores={agg.fpScores} />
          <PatternIntelligence driverScores={agg.driverScores} gapScores={agg.gapScores} />
        </>
      )}
    </div>
  );
}
