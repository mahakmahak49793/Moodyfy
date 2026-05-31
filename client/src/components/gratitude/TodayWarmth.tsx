import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Gratitude } from "../../features/gratitude/gratitudeTypes";

interface Props {
  gratitudes: Gratitude[];
}

const TodayWarmth = ({ gratitudes }: Props) => {
  // Pick a random entry — stable per session via useMemo
  const picked = useMemo(() => {
    if (!gratitudes.length) return null;
    const todayEntries = gratitudes.filter((g) => {
      const d = new Date(g.createdAt);
      const now = new Date();
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
    // Prefer today's entries, fall back to any
    const pool = todayEntries.length ? todayEntries : gratitudes;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [gratitudes.length]);

  if (!picked) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="rounded-2xl bg-gradient-to-br from-amber-50/50 via-teal-50/30 to-white/40
          backdrop-blur-sm border border-amber-200/40 shadow-sm p-5"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl"
          >
            🌅
          </motion.span>
          <p className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
            Today's warmth
          </p>
        </div>

        {/* Quote */}
        <p className="font-serif italic font-light text-slate-800 text-base leading-relaxed mb-4">
          "{picked.text}"
        </p>

        <div className="h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent mb-3" />

        {/* Meta */}
        <p className="text-[10px] font-mono font-medium text-amber-700/70">
          {new Date(picked.createdAt).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>

        {/* Gentle label */}
        <p className="text-xs font-light text-slate-500 mt-1">
          A moment worth holding onto ✨
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodayWarmth;