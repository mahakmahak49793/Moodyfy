import type { Journal } from "../../features/journal/journalTypes";
import type { AIInsight } from "../../features/insights/insightsTypes";
import { GlassCard } from "./InsightPrimitives";
import { getEmotionPill } from "./insightConstants";
import { useState } from "react";

// ─── Mood constellation ───────────────────────────────────────────────────────
const MOOD_ORB: Record<string, { color: string; glow: string; text: string }> = {
  happy:    { color: "#FCD34D", glow: "rgba(252,211,77,0.55)",  text: "text-amber-900"  },
  calm:     { color: "#2DD4BF", glow: "rgba(45,212,191,0.5)",   text: "text-teal-900"   },
  neutral:  { color: "#94A3B8", glow: "rgba(148,163,184,0.45)", text: "text-slate-700"  },
  stressed: { color: "#FB7185", glow: "rgba(251,113,133,0.5)",  text: "text-rose-900"   },
  sad:      { color: "#818CF8", glow: "rgba(129,140,248,0.5)",  text: "text-indigo-900" },
};

// Pre-set gentle positions so orbs breathe without crowding
const POSITIONS = [
  { cx: "22%", cy: "30%" },
  { cx: "65%", cy: "20%" },
  { cx: "80%", cy: "62%" },
  { cx: "38%", cy: "70%" },
  { cx: "10%", cy: "68%" },
];

export const MoodConstellation = ({ journals }: { journals: Journal[] }) => {
  const counts: Record<string, number> = {};
  journals.forEach((j) => { counts[j.mood] = (counts[j.mood] ?? 0) + 1; });
  const max = Math.max(...Object.values(counts), 1);
  const moods = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold tracking-widest text-slate-700 uppercase flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-teal-500/60" />
          Mood landscape
        </p>
        <span className="text-[10px] font-light text-slate-500">
          {journals.length} entries
        </span>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3"
        style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(12,40,50,0.9) 60%, rgba(30,15,40,0.8) 100%)" }}
      >
        {/* Star field */}
        {[...Array(22)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 4 === 0 ? 2 : 1,
              height: i % 4 === 0 ? 2 : 1,
              opacity: 0.25 + (i % 3) * 0.15,
              top: `${(i * 41 + 7) % 92}%`,
              left: `${(i * 67 + 13) % 94}%`,
            }}
          />
        ))}

        {/* Orbs */}
        {moods.slice(0, 5).map(([mood, count], i) => {
          const orb = MOOD_ORB[mood] ?? MOOD_ORB.neutral;
          const pos = POSITIONS[i];
          // radius: 16px (min) → 34px (max)
          const r = 16 + Math.round((count / max) * 18);
          const opacity = 0.55 + (count / max) * 0.45;

          return (
            <div
              key={mood}
              className="absolute flex flex-col items-center"
              style={{
                left: pos.cx,
                top: pos.cy,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Outer glow ring */}
              <div
                className="absolute rounded-full animate-pulse"
                style={{
                  width: r * 2 + 14,
                  height: r * 2 + 14,
                  background: orb.glow,
                  filter: "blur(8px)",
                  opacity: opacity * 0.7,
                  transform: "translate(-50%,-50%)",
                  top: "50%",
                  left: "50%",
                }}
              />
              {/* Core orb */}
              <div
                className="relative rounded-full z-10"
                style={{
                  width: r * 2,
                  height: r * 2,
                  background: orb.color,
                  opacity,
                  boxShadow: `0 0 ${r + 4}px ${orb.glow}`,
                }}
              />
              {/* Label below orb */}
              <span
                className={`relative z-10 mt-1.5 text-[10px] font-medium capitalize tracking-wide ${orb.text} drop-shadow`}
                style={{ color: orb.color, textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}
              >
                {mood}
              </span>
            </div>
          );
        })}

        {/* Connecting lines between orbs — subtle constellation lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
          {moods.slice(0, 4).map((_, i) => {
            const a = POSITIONS[i];
            const b = POSITIONS[i + 1];
            if (!a || !b) return null;
            return (
              <line
                key={i}
                x1={a.cx} y1={a.cy}
                x2={b.cx} y2={b.cy}
                stroke="white"
                strokeWidth="0.8"
                strokeDasharray="3 4"
              />
            );
          })}
        </svg>
      </div>

      {/* Frequency bars */}
      <div className="space-y-2 mt-2">
        {moods.slice(0, 4).map(([mood, count]) => {
          const orb = MOOD_ORB[mood] ?? MOOD_ORB.neutral;
          const percentage = (count / journals.length) * 100;
          return (
            <div key={mood} className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: orb.color }}
              />
              <span className="text-xs font-light text-slate-700 capitalize flex-1">
                {mood}
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500 min-w-[32px] text-right">
                {count}×
              </span>
              <div className="w-16 h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, background: orb.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {moods.length > 4 && (
        <p className="text-[10px] text-slate-500 mt-2 text-center">
          +{moods.length - 4} more moods
        </p>
      )}
    </GlassCard>
  );
};

// ─── Past reflection history card ─────────────────────────────────────────────
export const HistoryCard = ({
  insight,
  onSelect,
  active,
}: {
  insight: AIInsight;
  onSelect: () => void;
  active: boolean;
}) => {
  const pill = getEmotionPill(insight.emotion);
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${
        active
          ? "bg-white/50 border-teal-400/50 shadow-md"
          : "bg-white/25 border-white/40 hover:bg-white/40"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${pill}`}>
          {insight.emotion}
        </span>
        <span className="text-xs font-mono font-semibold text-slate-700">
          {new Date(insight.createdAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>
      </div>
      <p className="text-sm font-light text-slate-800 line-clamp-2 leading-relaxed font-serif italic">
        "{insight.summary}"
      </p>
    </button>
  );
};

// ─── View more button component ──────────────────────────────────────────────
export const ViewMoreButton = ({ 
  onClick, 
  count, 
  showAll 
}: { 
  onClick: () => void; 
  count: number;
  showAll: boolean;
}) => {
  if (count <= 3) return null;
  return (
    <button
      onClick={onClick}
      className="w-full mt-2 py-2 text-center text-xs font-medium text-teal-700 hover:text-teal-900 
                 bg-teal-50/50 rounded-lg border border-teal-200/50 hover:bg-teal-100/50 
                 transition-all duration-200"
    >
      {showAll ? "Show less ↑" : `View all ${count} reflections →`}
    </button>
  );
};
