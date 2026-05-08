import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase, APP_VERSION, SURVEY_VERSION } from '../lib/supabase.js';
import { DRIVERS } from '../lib/fpGapMap.js';
import { computeFullScores } from '../lib/scoring.js';
import { QUESTIONS_PER_DRIVER } from '../lib/weightMap.js';
import LoadingScreen from '../components/shared/LoadingScreen.jsx';
import LanguageSwitcher from '../components/shared/LanguageSwitcher.jsx';
import ProgressBar from '../components/survey/ProgressBar.jsx';
import DriverSection from '../components/survey/DriverSection.jsx';

const STAGE = { INTRO: 'intro', SURVEY: 'survey', SUBMITTING: 'submitting' };

export default function Survey() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(STAGE.INTRO);
  const [currentDriverIdx, setCurrentDriverIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { D1: {Q1: 3, ...}, ... }
  const [openEnded, setOpenEnded] = useState({}); // { D1: '...', ... }

  const currentDriver = DRIVERS[currentDriverIdx];

  useEffect(() => {
    async function loadBatch() {
      const { data, error } = await supabase
        .from('survey_batches')
        .select('id, name, status, credits_used, credits_allocated, organization_id')
        .eq('unique_link_token', token)
        .maybeSingle();

      if (error || !data) {
        setError(t('survey.error.invalidToken'));
      } else if (data.status !== 'active') {
        setError(t('survey.error.expired'));
      } else if (data.credits_used >= data.credits_allocated) {
        setError(t('survey.error.expired'));
      } else {
        setBatch(data);
      }
      setLoading(false);
    }
    loadBatch();
  }, [token, t]);

  const handleAnswer = (driverId, qId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [driverId]: { ...(prev[driverId] || {}), [qId]: value },
    }));
  };

  const handleOpenEnded = (driverId, value) => {
    setOpenEnded((prev) => ({ ...prev, [driverId]: value }));
  };

  const isCurrentDriverComplete = useMemo(() => {
    if (!currentDriver) return false;
    const numQ = QUESTIONS_PER_DRIVER[currentDriver.id] || 0;
    const drvAns = answers[currentDriver.id] || {};
    for (let i = 1; i <= numQ; i++) {
      if (drvAns[`Q${i}`] == null) return false;
    }
    return true;
  }, [currentDriver, answers]);

  async function handleSubmit() {
    setStage(STAGE.SUBMITTING);
    try {
      const scores = computeFullScores(answers);
      const { error: insErr } = await supabase.from('survey_responses').insert({
        batch_id: batch.id,
        raw_answers: answers,
        open_ended: openEnded,
        fp_scores: scores.fpScores,
        driver_scores: scores.driverScores,
        layer_scores: scores.layerScores,
        gap_scores: scores.gapScores,
        app_version: APP_VERSION,
        survey_version: SURVEY_VERSION,
        response_status: 'complete',
      });
      if (insErr) throw insErr;
      navigate(`/survey/${token}/thankyou`);
    } catch (err) {
      console.error(err);
      alert(t('survey.error.submitFailed'));
      setStage(STAGE.SURVEY);
    }
  }

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ansaka-paper p-6">
        <div className="card max-w-md text-center">
          <h1 className="font-serif text-xl font-semibold text-status-critical">
            {t('common.error')}
          </h1>
          <p className="mt-2 text-sm text-ansaka-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (stage === STAGE.INTRO) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ansaka-paper p-6">
        <div className="card max-w-2xl">
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-ansaka-gold">
            ANSAKA OAM Insight™
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ansaka-ink">
            {t('survey.title')}
          </h1>
          <div className="mt-6 space-y-4 text-sm text-ansaka-ink">
            <p>{t('survey.intro.welcome')}.</p>
            <p>{t('survey.intro.anonymous')}</p>
            <p className="text-ansaka-muted">{t('survey.intro.duration')}</p>
            <p>{t('survey.intro.instructions')}</p>
          </div>
          <button onClick={() => setStage(STAGE.SURVEY)} className="btn-primary mt-6">
            {t('survey.intro.start')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ansaka-paper py-6">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header with progress */}
        <div className="sticky top-0 z-10 -mx-4 mb-6 border-b border-gray-200 bg-ansaka-paper/95 px-4 py-3 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-ansaka-gold">
              ANSAKA OAM Insight™
            </p>
            <LanguageSwitcher />
          </div>
          <ProgressBar current={currentDriverIdx + 1} total={DRIVERS.length} />
        </div>

        <DriverSection
          driverId={currentDriver.id}
          answers={answers[currentDriver.id] || {}}
          openEnded={openEnded[currentDriver.id]}
          onAnswer={handleAnswer}
          onOpenEnded={handleOpenEnded}
        />

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentDriverIdx((i) => Math.max(0, i - 1))}
            disabled={currentDriverIdx === 0}
            className="btn-secondary"
          >
            {t('common.previous')}
          </button>
          {currentDriverIdx < DRIVERS.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                if (!isCurrentDriverComplete) {
                  alert(t('common.required'));
                  return;
                }
                setCurrentDriverIdx((i) => i + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-primary"
            >
              {t('common.next')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isCurrentDriverComplete) {
                  alert(t('common.required'));
                  return;
                }
                handleSubmit();
              }}
              disabled={stage === STAGE.SUBMITTING}
              className="btn-primary"
            >
              {stage === STAGE.SUBMITTING ? t('survey.submitting') : t('survey.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
