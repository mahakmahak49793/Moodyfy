import type { Journal } from "../../features/journal/journalTypes";
import { MOOD_COLORS } from "./insightConstants";

interface JournalPickerProps {
  journals: Journal[];
  selectedId: string | null;
  onSelect: (journal: Journal) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const JournalPicker = ({
  journals,
  selectedId,
  onSelect,
  onAnalyze,
  loading,
}: JournalPickerProps) => (
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="border-b border-white/30 px-5 py-6">
      <h1
        className="font-serif italic font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] mb-1"
        style={{ fontSize: "1.4rem", lineHeight: 1.2 }}
      >
        Your Journals
      </h1>
      <p className="text-sm font-light text-white/80 drop-shadow mt-1">
        Select one to reflect on
      </p>
    </div>

    {/* Journal list */}
    <div className="flex-1 overflow-y-auto py-3 space-y-1 px-3">
      {journals.length === 0 && (
        <p className="text-sm font-light text-slate-300 text-center py-10">
          No journals yet. Write one first.
        </p>
      )}
      {journals.map((j) => {
        const mood = MOOD_COLORS[j.mood] ?? MOOD_COLORS.neutral;
        const active = selectedId === j._id;
        return (
          <div
            key={j._id}
            onClick={() => onSelect(j)}
            className={`px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${
              active
                ? "bg-[rgb(3_131_153/0.22)] border-[rgb(3_131_153/0.5)]"
                : "border-transparent hover:bg-white/20"
            }`}
          >
            <p className="font-mono text-xs font-semibold text-teal-700 mb-1.5">
              {new Date(j.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-sm font-medium text-slate-800 truncate flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${mood.dot}`}
              />
              {j.title || "Untitled"}
            </p>
            <p className="text-xs font-light text-slate-600 truncate mt-1">
              {j.content.slice(0, 55)}…
            </p>
          </div>
        );
      })}
    </div>

    {/* Mobile-only analyze button (desktop has it inside the preview panel) */}
    <div className="px-4 py-4 border-t border-white/30 lg:hidden">
      <button
        onClick={onAnalyze}
        disabled={!selectedId || loading}
        className="w-full rounded-full border border-white/50 bg-white/30 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white
          transition-all hover:border-teal-400/70 hover:bg-teal-500/20
          disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? "Reflecting…" : "✦ Analyze journal"}
      </button>
    </div>
  </div>
);

export default JournalPicker;
