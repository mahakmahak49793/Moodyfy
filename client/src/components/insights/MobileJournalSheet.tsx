import type { Journal } from "../../features/journal/journalTypes";
import { MOOD_COLORS } from "./insightConstants";

interface MobileJournalSheetProps {
  journal: Journal | null;
  onClose: () => void;
  onAnalyze: () => void;
  loading: boolean;
}

const MobileJournalSheet = ({
  journal,
  onClose,
  onAnalyze,
  loading,
}: MobileJournalSheetProps) => {
  if (!journal) return null;

  const mood = MOOD_COLORS[journal.mood] ?? MOOD_COLORS.neutral;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="
          fixed bottom-0 left-0 right-0 z-50 lg:hidden
          rounded-t-3xl bg-white/70 backdrop-blur-xl
          border-t border-white/60 shadow-2xl
          flex flex-col
          max-h-[78vh]
          animate-[slideUp_0.3s_ease_both]
        "
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300/70" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-4 border-b border-slate-200/40">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border backdrop-blur-sm ${mood.bg} ${mood.text} ${mood.border}`}
            >
              {journal.mood}
            </span>
            <span className="font-mono text-xs font-semibold text-slate-600">
              {new Date(journal.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <h3 className="font-serif italic font-light text-slate-900 text-xl leading-snug">
            {journal.title || "Untitled"}
          </h3>
        </div>

        {/* Scrollable content preview */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-sm font-light leading-relaxed text-slate-700">
            {journal.content}
          </p>
        </div>

        {/* Action buttons */}
        <div className="px-5 pt-3 pb-6 flex gap-3 border-t border-slate-200/40 bg-white/30 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-300/60 bg-white/50 py-3 text-sm font-light text-slate-700 hover:bg-white/70 transition-all"
          >
            Close
          </button>
          <button
            onClick={() => { onAnalyze(); onClose(); }}
            disabled={loading}
            className="flex-[2] rounded-full border border-teal-400/60 bg-teal-500/20 py-3 text-sm font-medium text-teal-900
              hover:bg-teal-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 rounded-full border border-teal-700/50 border-t-teal-700 animate-spin" />
                Reflecting…
              </>
            ) : (
              <>✦ Analyze this journal</>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileJournalSheet;