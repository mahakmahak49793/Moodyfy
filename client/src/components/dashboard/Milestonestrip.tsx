import { motion } from "framer-motion";
import { useMemo } from "react";

interface Props {
  totalEntries: number;
  streak: number;
  gratitudeCount: number;
}

interface Milestone {
  icon: string;
  label: string;
  sublabel: string;
  achieved: boolean;
  progress: number; // 0–1
}

const MilestoneStrip = ({ totalEntries, streak, gratitudeCount }: Props) => {
  const milestones: Milestone[] = useMemo(() => [
    {
      icon: "✍️",
      label: "First entry",
      sublabel: "The beginning",
      achieved: totalEntries >= 1,
      progress: Math.min(totalEntries / 1, 1),
    },
    {
      icon: "🔥",
      label: "7-day streak",
      sublabel: `${Math.min(streak, 7)} / 7 days`,
      achieved: streak >= 7,
      progress: Math.min(streak / 7, 1),
    },
    {
      icon: "📖",
      label: "10 entries",
      sublabel: `${Math.min(totalEntries, 10)} / 10`,
      achieved: totalEntries >= 10,
      progress: Math.min(totalEntries / 10, 1),
    },
    {
      icon: "🌿",
      label: "5 gratitudes",
      sublabel: `${Math.min(gratitudeCount, 5)} / 5`,
      achieved: gratitudeCount >= 5,
      progress: Math.min(gratitudeCount / 5, 1),
    },
    {
      icon: "🌊",
      label: "30-day streak",
      sublabel: `${Math.min(streak, 30)} / 30 days`,
      achieved: streak >= 30,
      progress: Math.min(streak / 30, 1),
    },
    {
      icon: "💎",
      label: "50 entries",
      sublabel: `${Math.min(totalEntries, 50)} / 50`,
      achieved: totalEntries >= 50,
      progress: Math.min(totalEntries / 50, 1),
    },
  ], [totalEntries, streak, gratitudeCount]);

  return (
    <section className="rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-lg overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-teal-100/60">
        <p className="text-[9px] font-semibold tracking-widest text-teal-600 uppercase">
          Your milestones
        </p>
        <h3 className="font-serif italic text-base text-slate-800 mt-0.5">
          Every step forward counts
        </h3>
      </div>

      <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {milestones.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`relative flex flex-col items-center gap-2 rounded-xl px-2 py-3 border transition-all ${
              m.achieved
                ? "bg-teal-50 border-teal-300 shadow-sm"
                : "bg-gray-50/80 border-gray-200"
            }`}
          >
            {/* Icon with radial progress ring */}
            <div className="relative w-11 h-11">
              <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke={m.achieved ? "rgba(20,184,166,0.15)" : "rgba(0,0,0,0.06)"}
                  strokeWidth="3"
                />
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke={m.achieved ? "rgb(20,184,166)" : "rgba(0,0,0,0.12)"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${m.progress * 113} 113`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg ${m.achieved ? "" : "opacity-40"}`}>
                  {m.icon}
                </span>
              </div>
            </div>

            <div className="text-center">
              <p
                className={`text-[10px] font-medium leading-tight ${
                  m.achieved ? "text-teal-800" : "text-gray-400"
                }`}
              >
                {m.label}
              </p>
              <p
                className={`text-[8px] mt-0.5 font-mono ${
                  m.achieved ? "text-teal-500" : "text-gray-300"
                }`}
              >
                {m.achieved ? "✓ unlocked" : m.sublabel}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MilestoneStrip;