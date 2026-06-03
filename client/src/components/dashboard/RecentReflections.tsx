import { motion, AnimatePresence } from "framer-motion";

interface JournalEntry {
  _id: string;
  text: string;
  mood?: string;
  createdAt: string;
}

interface Props {
  entries: JournalEntry[];
  onViewAll?: () => void;
}

const CARD_ACCENT = [
  { dot: "bg-teal-400", ring: "border-teal-200/60" },
  { dot: "bg-amber-400", ring: "border-amber-200/60" },
  { dot: "bg-indigo-400", ring: "border-indigo-200/60" },
  { dot: "bg-rose-400", ring: "border-rose-200/60" },
];

const formatRelative = (dateStr: string) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const INITIAL_SHOW = 4;

const RecentReflections = ({ entries, onViewAll }: Props) => {
const visible = entries.slice(0, INITIAL_SHOW);
  if (!entries.length) return null;

  return (
    <section>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-semibold tracking-widest text-teal-600 uppercase flex items-center gap-2">
            <span className="inline-block w-4 h-px bg-teal-500" />
            Recent reflections
            <span className="text-[9px] font-normal text-gray-500">
              ({entries.length} total)
            </span>
          </p>
          <h2 className="mt-0.5 font-serif text-lg font-light text-slate-800">
            Your emotional journey
          </h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-light text-slate-500 transition-all hover:text-teal-600 hover:border-teal-300"
          >
            View all →
          </button>
        )}
      </div>

      {/* Cards grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence>
          {visible.map((entry, i) => {
            const accent = CARD_ACCENT[i % CARD_ACCENT.length];
            return (
              <motion.div
                key={entry._id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`rounded-2xl border bg-white/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-all duration-300 ${accent.ring}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                    {entry.mood && (
                      <span className="rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-light text-teal-700">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-light text-slate-400">
                    {formatRelative(entry.createdAt)}
                  </span>
                </div>

                <p className="text-sm font-light font-serif italic leading-relaxed text-slate-600 line-clamp-3">
                  "{entry.text}"
                </p>

                <div className="mt-3 h-px bg-gradient-to-r from-transparent via-teal-200/40 to-transparent" />

                <p className="mt-2 font-mono text-[9px] text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

    
    </section>
  );
};

export default RecentReflections;