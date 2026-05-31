import type { AIInsight } from "../../features/insights/insightsTypes";
import { GlassCard, Section } from "./InsightPrimitives";
import { getEmotionPill } from "./insightConstants";

const InsightPanel = ({ insight }: { insight: AIInsight }) => {
  const pill = getEmotionPill(insight.emotion);

  return (
    <div className="animate-[fadeSlideUp_0.5s_ease_both]">

      {/* ── Emotion hero card ── */}
      <GlassCard className="mb-6 text-center">
        <p className="text-xs font-semibold tracking-widest text-slate-700 uppercase mb-3">
          Dominant emotion
        </p>
        <span
          className={`inline-block text-sm font-medium px-5 py-1.5 rounded-full border backdrop-blur-sm ${pill}`}
        >
          {insight.emotion}
        </span>
        <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
        <p className="mt-5 text-base font-light leading-relaxed text-slate-800 font-serif italic">
          "{insight.summary}"
        </p>
      </GlassCard>

      {/* ── Triggers ── */}
      {insight.triggers?.length > 0 && (
        <Section title="What stirred you">
          <GlassCard>
            <ul className="space-y-3">
              {insight.triggers.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                  <span className="text-sm font-light leading-relaxed text-slate-800">{t}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Section>
      )}

      {/* ── Positive moments ── */}
      {insight.positiveMoments?.length > 0 && (
        <Section title="Light you carried">
          <GlassCard>
            <ul className="space-y-3">
              {insight.positiveMoments.map((m, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                  <span className="text-sm font-light leading-relaxed text-slate-800">{m}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Section>
      )}

      {/* ── Suggestion ── */}
      {insight.suggestion && (
        <Section title="A gentle nudge">
          <GlassCard className="border-teal-300/40 bg-teal-50/25">
            <p className="text-sm font-light leading-relaxed text-slate-800 font-serif italic">
              {insight.suggestion}
            </p>
          </GlassCard>
        </Section>
      )}
    </div>
  );
};

export default InsightPanel;