import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Category = "quote" | "reflection" | "stoic" | "psychology";

interface Insight {
  text: string;
  author?: string;
  category: Category;
  prompt: string;
}

const INSIGHTS: Insight[] = [
  { category: "quote",      text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, or anxious.", author: "Lori Deschene",   prompt: "What emotion am I resisting right now?" },
  { category: "stoic",      text: "You have power over your mind, not outside events. Realize this, and you will find strength.",    author: "Marcus Aurelius", prompt: "What can I actually control today?" },
  { category: "reflection", text: "Small steps count more than occasional bursts of motivation. Consistency is a quiet superpower.", prompt: "What one small thing could I do every day?" },
  { category: "psychology", text: "Naming your emotions reduces their intensity. Saying 'I feel anxious' calms the nervous system.",  prompt: "What am I feeling right now, named precisely?" },
  { category: "quote",      text: "The wound is the place where the light enters you.",                                              author: "Rumi",            prompt: "What difficulty has quietly made me stronger?" },
  { category: "stoic",      text: "Waste no more time arguing what a good person should be. Be one.",                               author: "Marcus Aurelius", prompt: "Where is there a gap between who I want to be and how I act?" },
  { category: "reflection", text: "Rest is not a reward for finishing everything. It's part of how you finish anything.",            prompt: "What would I do differently if rest felt productive?" },
  { category: "psychology", text: "Avoidance gives short-term relief and long-term suffering. Approach gives long-term freedom.",    prompt: "What am I avoiding, and what is it costing me?" },
  { category: "quote",      text: "Almost everything will work again if you unplug it for a few minutes — including you.",          author: "Anne Lamott",     prompt: "When did I last truly rest?" },
  { category: "stoic",      text: "It is not the man who has too little, but the man who craves more, that is poor.",               author: "Seneca",          prompt: "What do I already have that I'm not appreciating?" },
  { category: "reflection", text: "Your emotions aren't problems to fix. They're signals worth listening to.",                      prompt: "What has a recurring emotion been trying to tell me?" },
  { category: "psychology", text: "Gratitude rewires the brain's negativity bias — noting three small things shifts your baseline.", prompt: "What three small things am I grateful for today?" },
];

const CAT: Record<Category, { label: string; color: string; bg: string; border: string }> = {
  quote:      { label: "Quote",      color: "#0f766e", bg: "bg-teal-50",   border: "border-teal-200"   },
  reflection: { label: "Reflection", color: "#7c3aed", bg: "bg-violet-50", border: "border-violet-200" },
  stoic:      { label: "Stoic",      color: "#92400e", bg: "bg-amber-50",  border: "border-amber-200"  },
  psychology: { label: "Psychology", color: "#075985", bg: "bg-sky-50",    border: "border-sky-200"    },
};

const getDailyIndex = () => Math.floor(Date.now() / 86400000) % INSIGHTS.length;

const DailyInsight = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(getDailyIndex);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const insight = INSIGHTS[index];
  const style = CAT[insight.category];

  const next = useCallback((dir = 1) => {
    setDirection(dir);
    setIndex((i) => (i + dir + INSIGHTS.length) % INSIGHTS.length);
  }, []);

  // Auto-rotate every 8 seconds unless paused
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => next(1), 8000);
    return () => clearTimeout(t);
  }, [index, paused, next]);

  return (
    <div
      className="rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-md overflow-hidden h-full flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-400">
            Daily insight
          </p>
          <AnimatePresence mode="wait">
            <motion.span
              key={insight.category}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${style.bg} ${style.border}`}
              style={{ color: style.color }}
            >
              {style.label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setPaused(true); next(-1); }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => { setPaused(true); next(1); }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Insight body */}
      <div className="flex-1 px-4 py-3 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={{
              enter: (d) => ({ opacity: 0, x: d > 0 ? 24 : -24 }),
              center: { opacity: 1, x: 0 },
              exit: (d) => ({ opacity: 0, x: d > 0 ? -24 : 24 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {/* Accent bar + quote */}
            <div className="flex gap-2.5 items-start mb-2.5">
              <div
                className="w-0.5 rounded-full flex-shrink-0 mt-0.5"
                style={{ height: 36, background: style.color, opacity: 0.5 }}
              />
              <p className="font-serif italic text-slate-700 text-[13px] leading-snug">
                "{insight.text}"
              </p>
            </div>
            {insight.author && (
              <p className="text-[10px] font-mono text-slate-400 ml-3 mb-2.5">
                — {insight.author}
              </p>
            )}

            {/* Reflect prompt chip */}
            <div
              className={`rounded-lg px-3 py-2 border text-[11px] text-slate-500 leading-snug ${style.bg} ${style.border}`}
            >
              <span className="font-medium" style={{ color: style.color }}>Reflect → </span>
              {insight.prompt}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer — progress dots + CTA */}
      <div className="px-4 pb-3.5 flex items-center justify-between gap-3">
        {/* Progress dots */}
        <div className="flex items-center gap-1">
          {INSIGHTS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); setDirection(i > index ? 1 : -1); setIndex(i); }}
              className="transition-all duration-300"
              style={{
                width: i === index ? 16 : 4,
                height: 4,
                borderRadius: 99,
                background: i === index ? style.color : "#e2e8f0",
              }}
            />
          ))}
        </div>

        {/* Write CTA */}
        <button
          onClick={() => navigate("/journal", { state: { prompt: insight.prompt } })}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium border border-teal-300/60 bg-teal-50/60 text-teal-700 hover:bg-teal-100/70 transition-all flex-shrink-0"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Write about this
        </button>
      </div>
    </div>
  );
};

export default DailyInsight;