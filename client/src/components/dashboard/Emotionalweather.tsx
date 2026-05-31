import { useMemo } from "react";
import { motion } from "framer-motion";

interface Entry {
  _id: string;
  mood?: string;
  createdAt: string;
}

interface Props {
  entries: Entry[];
}

const MOOD_META: Record<string, { color: string; bgLight: string; text: string; emoji: string }> = {
  happy:    { color: "#F59E0B", bgLight: "#FEF3C7", text: "#92400E", emoji: "☀️" },
  calm:     { color: "#10B981", bgLight: "#D1FAE5", text: "#065F46", emoji: "🌿" },
  neutral:  { color: "#9CA3AF", bgLight: "#F3F4F6", text: "#4B5563", emoji: "✨" },
  stressed: { color: "#3B82F6", bgLight: "#DBEAFE", text: "#1E3A8A", emoji: "🌊" },
  sad:      { color: "#8B5CF6", bgLight: "#EDE9FE", text: "#5B21B6", emoji: "🌙" },
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EmotionalWeather = ({ entries }: Props) => {
  const last7 = useMemo(() => {
    const since = new Date();
    since.setDate(since.getDate() - 6);
    return entries
      .filter((e) => e.mood && new Date(e.createdAt) >= since)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [entries]);

  const weeklyData = useMemo(() => {
    const data: { date: Date; mood: string | null; dayName: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toLocaleDateString("en-CA");
      const entry = last7.find(
        (e) => new Date(e.createdAt).toLocaleDateString("en-CA") === key
      );
      data.push({
        date: d,
        mood: entry?.mood || null,
        dayName: WEEKDAYS[d.getDay() === 0 ? 6 : d.getDay() - 1],
      });
    }
    return data;
  }, [last7]);

  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    last7.forEach((e) => {
      if (!e.mood) return;
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [last7]);

  const dominantMood = moodCounts[0]?.[0];
  const dominantMeta = dominantMood ? MOOD_META[dominantMood] : null;
  const totalEntries = last7.length;

  const getMoodPercentage = (mood: string) => {
    const count = moodCounts.find(([m]) => m === mood)?.[1] || 0;
    return totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
  };

  if (!entries.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-white via-teal-50/30 to-white border border-teal-100/60 shadow-lg overflow-hidden"
    >
      {/* Header with gradient accent */}
      <div className="relative px-5 pt-5 pb-3 bg-gradient-to-r from-teal-500/5 to-amber-500/5 border-b border-teal-100/40">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full" />
              <p className="text-[10px] font-bold tracking-[0.2em] text-teal-600 uppercase">
                Emotional Weather
              </p>
            </div>
            <h3 className="font-serif text-xl text-slate-800 mt-1 leading-tight">
              How you've been
            </h3>
          </div>

          {/* Dominant mood badge */}
          {dominantMeta && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-col items-center bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-sm border border-teal-100"
            >
              <span className="text-[9px] font-medium text-slate-500 mt-0.5">Most felt</span>
              <span className="text-[10px] font-bold" style={{ color: dominantMeta.text }}>
                {dominantMood}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="px-5 py-3 space-y-3">
        {/* Weekly mood timeline - smaller bars */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            This week's journey
          </p>
          <div className="flex justify-between items-end gap-0.5">
            {weeklyData.map((day, idx) => {
              const meta = day.mood ? MOOD_META[day.mood] : null;
              // Reduced bar heights - max 32px instead of larger
              const height = meta ? 12 + (getMoodPercentage(day.mood) * 0.8) : 12;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-full flex flex-col items-center"
                  >
                    {/* Mood bar - smaller */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      style={{
                        width: "100%",
                        height,
                        background: meta ? `linear-gradient(180deg, ${meta.color}40, ${meta.color})` : "#E5E7EB",
                        borderRadius: "6px 6px 3px 3px",
                        cursor: "pointer",
                      }}
                      className="relative group"
                    >
                      {/* Mood emoji tooltip */}
                      {meta && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                            {day.mood} {meta.emoji}
                          </div>
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Day label */}
                    <span className="text-[8px] font-mono text-slate-400 mt-1">
                      {day.dayName}
                    </span>
                    
                    {/* Dot indicator for today */}
                    {idx === weeklyData.length - 1 && (
                      <div className="w-1 h-1 rounded-full bg-teal-500 mt-0.5" />
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Insightful quote/sentence */}
        {moodCounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative bg-gradient-to-r from-teal-50/80 to-amber-50/80 rounded-xl p-3 border border-teal-100/50"
          >
            <div className="absolute top-1.5 left-2 text-teal-300 text-[10px]">"</div>
            <p className="font-serif italic text-[11px] text-slate-600 leading-relaxed pl-4 pr-2">
              {moodCounts.length === 1 ? (
                <>This week, you've been mostly feeling <span style={{ color: dominantMeta?.text }} className="font-medium">{dominantMood}</span>. That's completely okay — every emotion has its place.</>
              ) : (
                <>Your emotions have been between <span style={{ color: MOOD_META[moodCounts[0][0]]?.text }} className="font-medium">{moodCounts[0][0]}</span> and <span style={{ color: MOOD_META[moodCounts[1][0]]?.text }} className="font-medium">{moodCounts[1][0]}</span> this week — a beautiful reflection of being human.</>
              )}
            </p>
          </motion.div>
        )}

        {/* Mood distribution bars - smaller */}
        {moodCounts.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Mood distribution
            </p>
            <div className="space-y-2">
              {moodCounts.slice(0, 4).map(([label, count], idx) => {
                const meta = MOOD_META[label];
                const percentage = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
                
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.08 }}
                    className="group"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm">{meta.emoji}</span>
                        <span className="text-[10px] font-medium" style={{ color: meta.text }}>
                          {label}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.6, delay: 0.5 + idx * 0.05 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${meta.color}80, ${meta.color})` }}
                          />
                        </div>
                      </div>
                      <span className="font-mono text-[8px] text-slate-400 w-7 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {moodCounts.length === 0 && (
          <div className="text-center py-6">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-2xl mb-2 opacity-60"
            >
              🌤️
            </motion.div>
            <p className="font-serif italic text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
              Log your moods to see your emotional weather patterns emerge.
            </p>
            <div className="mt-2 flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-teal-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default EmotionalWeather;