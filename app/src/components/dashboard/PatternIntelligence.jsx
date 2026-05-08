import { useTranslation } from 'react-i18next';

/**
 * Generate hypothesis cards based on driver score patterns.
 * Logic per System Blueprint §6.1.E (Pattern Intelligence).
 */
function generateHypotheses(driverScores, gapScores, lang) {
  const cards = [];
  const d1 = driverScores.D1, d3 = driverScores.D3, d5 = driverScores.D5;
  const d6 = driverScores.D6, d7 = driverScores.D7, d9 = driverScores.D9;

  if (d1 != null && d3 != null && d1 > 3.0 && d3 < 2.8) {
    cards.push({
      title: lang === 'id' ? 'Terdeteksi Potensi Leadership Misalignment' : 'Potential Leadership Misalignment',
      body: lang === 'id'
        ? 'Visi organisasi cukup jelas, namun pesan kepemimpinan terasa tidak konsisten di lapangan. Hal ini sering muncul ketika strategi belum diterjemahkan secara seragam oleh tim manajemen.'
        : 'Organizational vision is clear, but leadership messaging feels inconsistent on the ground. This commonly emerges when strategy has not been uniformly translated by management.',
    });
  }
  if (d6 != null && d7 != null && d6 < 2.8 && d7 < 2.8) {
    cards.push({
      title: lang === 'id' ? 'Execution Bottleneck Risk' : 'Execution Bottleneck Risk',
      body: lang === 'id'
        ? 'Sistem KPI dan akuntabilitas performa sama-sama lemah. Eksekusi strategi berisiko terhambat tanpa intervensi pada management system.'
        : 'KPI system and performance accountability are both weak. Strategy execution is at risk of stalling without intervention in the management system.',
    });
  }
  if (d5 != null && d9 != null && d5 < 2.8 && d9 < 2.8) {
    cards.push({
      title: lang === 'id' ? 'Cross-Functional Friction' : 'Cross-Functional Friction',
      body: lang === 'id'
        ? 'Pengambilan keputusan dan kolaborasi antar tim sama-sama bermasalah. Pola ini biasanya menunjukkan friksi struktural antar fungsi.'
        : 'Decision-making and cross-team collaboration are both struggling. This pattern usually reveals structural friction between functions.',
    });
  }

  // Top gap-based hypothesis
  const lowestGap = Object.entries(gapScores || {})
    .filter(([, v]) => v != null)
    .sort((a, b) => a[1] - b[1])[0];
  if (lowestGap && lowestGap[1] < 2.8) {
    cards.push({
      title: lang === 'id' ? `Gap Hipotesis Utama: ${lowestGap[0]}` : `Primary Gap Hypothesis: ${lowestGap[0]}`,
      body: lang === 'id'
        ? `Pola jawaban menunjukkan bahwa "${lowestGap[0]}" merupakan area yang perlu eksplorasi lebih dalam melalui interview dan FGD.`
        : `Response patterns suggest "${lowestGap[0]}" is an area requiring deeper exploration via interview and FGD.`,
    });
  }

  if (cards.length === 0) {
    cards.push({
      title: lang === 'id' ? 'Profil Stabil' : 'Stable Profile',
      body: lang === 'id'
        ? 'Tidak ada pola kritis terdeteksi. Organisasi menunjukkan profil keseimbangan yang sehat.'
        : 'No critical patterns detected. The organization shows a healthy balance profile.',
    });
  }

  return cards;
}

export default function PatternIntelligence({ driverScores, gapScores }) {
  const { t, i18n } = useTranslation();
  const cards = generateHypotheses(driverScores, gapScores, i18n.language);

  return (
    <section className="card">
      <div className="mb-4">
        <h2 className="font-serif text-xl font-semibold text-ansaka-ink">
          {t('dashboard.patternIntelligence')}
        </h2>
        <p className="mt-1 text-sm text-ansaka-muted">
          {i18n.language === 'id'
            ? 'Hipotesis pola — perlu validasi melalui Interview & FGD'
            : 'Pattern hypotheses — to be validated via Interview & FGD'}
        </p>
      </div>
      <div className="space-y-3">
        {cards.map((c, i) => (
          <div key={i} className="rounded-md border-l-4 border-ansaka-gold bg-ansaka-gold/5 p-4">
            <p className="text-sm font-semibold text-ansaka-gold-dark">{c.title}</p>
            <p className="mt-1 text-sm text-ansaka-ink">{c.body}</p>
          </div>
        ))}
      </div>
      <button className="btn-primary mt-4">
        {t('dashboard.requestDeepDive')}
      </button>
    </section>
  );
}
