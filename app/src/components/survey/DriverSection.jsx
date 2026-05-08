import { useTranslation } from 'react-i18next';
import LikertQuestion from './LikertQuestion.jsx';
import OpenEndedQuestion from './OpenEndedQuestion.jsx';
import { QUESTIONS_PER_DRIVER } from '../../lib/weightMap.js';

export default function DriverSection({ driverId, answers, openEnded, onAnswer, onOpenEnded }) {
  const { t } = useTranslation();
  const numQ = QUESTIONS_PER_DRIVER[driverId] || 0;

  return (
    <div className="space-y-4">
      <div className="border-b border-ansaka-gold/30 pb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-ansaka-gold">
          {driverId}
        </p>
        <h2 className="text-2xl font-serif font-semibold text-ansaka-ink">
          {t(`drivers.${driverId}`)}
        </h2>
      </div>

      {Array.from({ length: numQ }, (_, i) => {
        const qId = `Q${i + 1}`;
        return (
          <LikertQuestion
            key={qId}
            questionId={qId}
            questionText={t(`questions.${driverId}.${qId}`)}
            value={answers[qId]}
            onChange={(qId, val) => onAnswer(driverId, qId, val)}
          />
        );
      })}

      <OpenEndedQuestion
        questionText={t(`questions.${driverId}.openEnded`)}
        value={openEnded}
        onChange={(val) => onOpenEnded(driverId, val)}
      />
    </div>
  );
}
