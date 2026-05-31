import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface GratitudeEntry {
  _id: string;
  text: string;
  createdAt: string;
}

interface Props {
  entries: GratitudeEntry[];
  streak?: number;
}

const GratitudeDiaryCard = ({ entries, streak }: Props) => {
  const navigate = useNavigate();
  const latest = entries.slice(0, 2);
  const todayCount = entries.filter(
    (e) =>
      new Date(e.createdAt).toLocaleDateString("en-CA") ===
      new Date().toLocaleDateString("en-CA")
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl bg-white/90 border border-teal-200/50 shadow-lg overflow-hidden"
      style={{ minHeight: 300 }}
    >
      <div className="h-full flex flex-col gap-3 p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-widest text-teal-600 uppercase">
              Gratitude diary
            </p>
            <h3 className="font-serif italic text-lg text-slate-800 mt-0.5 leading-tight">
              Small beautiful things
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            {streak && streak > 0 ? (
              <span className="text-xs bg-teal-100 border border-teal-300 text-teal-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                🔥 {streak} days
              </span>
            ) : null}
            {todayCount > 0 && (
              <span className="text-[9px] text-gray-500 font-light">
                {todayCount} written today
              </span>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent" />

        {/* Recent entries */}
        {latest.length > 0 ? (
          <div className="flex-1 space-y-2 overflow-hidden">
            {latest.map((entry, i) => (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-teal-50/70 border border-teal-200/50 p-3"
              >
                <p className="font-serif italic text-xs text-slate-600 leading-relaxed line-clamp-2">
                  "{entry.text}"
                </p>
                <p className="font-mono text-[9px] text-teal-500 mt-1.5">
                  {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-2xl mb-2 opacity-60"
            >
              🌸
            </motion.div>
            <p className="font-serif italic text-xs text-gray-500 max-w-[160px] leading-relaxed">
              Your first gratitude is waiting to be written…
            </p>
          </div>
        )}

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/gratitude")}
          className="w-full rounded-full bg-teal-500/15 border border-teal-400/40 py-2 text-xs font-medium text-teal-700 hover:bg-teal-500/25 transition-all flex items-center justify-center gap-1.5"
        >
          🌿 Open gratitude diary →
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GratitudeDiaryCard;