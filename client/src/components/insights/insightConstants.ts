export const MOOD_COLORS: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  happy:    { bg: "bg-amber-50/60",  text: "text-amber-800",  dot: "bg-amber-400",  border: "border-amber-200/50" },
  calm:     { bg: "bg-teal-50/60",   text: "text-teal-800",   dot: "bg-teal-400",   border: "border-teal-200/50"  },
  neutral:  { bg: "bg-slate-100/60", text: "text-slate-700",  dot: "bg-slate-400",  border: "border-slate-200/50" },
  stressed: { bg: "bg-rose-50/60",   text: "text-rose-800",   dot: "bg-rose-400",   border: "border-rose-200/50"  },
  sad:      { bg: "bg-indigo-50/60", text: "text-indigo-800", dot: "bg-indigo-400", border: "border-indigo-200/50" },
};

// Emotion pill styles — solid enough to read on light & semi-transparent backgrounds
const EMOTION_PALETTE: Record<string, string> = {
  joy:       "bg-amber-200/80  text-amber-900  border-amber-300/60",
  happiness: "bg-amber-200/80  text-amber-900  border-amber-300/60",
  happy:     "bg-amber-200/80  text-amber-900  border-amber-300/60",
  calm:      "bg-teal-200/80   text-teal-900   border-teal-300/60",
  peaceful:  "bg-teal-200/80   text-teal-900   border-teal-300/60",
  sad:       "bg-indigo-200/80 text-indigo-900 border-indigo-300/60",
  sadness:   "bg-indigo-200/80 text-indigo-900 border-indigo-300/60",
  anxious:   "bg-rose-200/80   text-rose-900   border-rose-300/60",
  stressed:  "bg-rose-200/80   text-rose-900   border-rose-300/60",
  angry:     "bg-red-200/80    text-red-900    border-red-300/60",
  neutral:   "bg-slate-200/80  text-slate-800  border-slate-300/60",
};

export const getEmotionPill = (emotion: string): string => {
  const key = emotion?.toLowerCase().trim();
  return EMOTION_PALETTE[key] ?? EMOTION_PALETTE.neutral;
};