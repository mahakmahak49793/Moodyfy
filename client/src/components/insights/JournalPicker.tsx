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
    {/* Header - matching journal sidebar style */}
    <div className="border-b border-white/30 px-4 sm:px-6 py-5 sm:py-6">
      <h1
        className="font-serif italic font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] mb-1"
        style={{ fontSize: "1.45rem", letterSpacing: "-0.01em", lineHeight: 1.2 }}
      >
        Your Journals
      </h1>
      <p className="text-xs font-light text-white/80 drop-shadow mt-1">
        {journals.length} {journals.length === 1 ? "journal" : "journals"} total
      </p>
    </div>

    {/* Journal list - matching sidebar entry style */}
    <div className="flex-1 overflow-y-auto py-3">
      {journals.length === 0 && (
        <div className="px-4 sm:px-6 py-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-sm font-light text-white/80 drop-shadow-sm">No journals yet</p>
          <p className="text-xs font-light text-white/60 mt-2 drop-shadow-sm">Write your first journal entry →</p>
        </div>
      )}
      
      {journals.map((j) => {
        const mood = MOOD_COLORS[j.mood] ?? MOOD_COLORS.neutral;
        const active = selectedId === j._id;
        return (
          <div
            key={j._id}
            onClick={() => onSelect(j)}
            className={`px-4 sm:px-5 py-3 sm:py-4 cursor-pointer transition-all duration-200 ${
              active
                ? "bg-[rgb(3_131_153/0.15)] border-l-4 border-[rgb(3_131_153)] backdrop-blur-sm"
                : "border-l-4 border-transparent hover:bg-white/20 backdrop-blur-sm"
            }`}
          >
            <p className="font-mono text-[10px] text-slate-600 mb-1.5 tracking-wider">
              {new Date(j.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-[13px] sm:text-[14px] font-light text-slate-800 truncate flex items-center gap-2">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${mood.dot}`}
              />
              {j.title || "Untitled"}
            </p>
            <p className="text-[11px] sm:text-[12px] font-light text-slate-600 truncate mt-1">
              {j.content.slice(0, 60)}...
            </p>
          </div>
        );
      })}
    </div>

    {/* Mobile-only analyze button */}
    <div className="px-4 sm:px-5 py-4 border-t border-white/30 lg:hidden">
      <button
        onClick={onAnalyze}
        disabled={!selectedId || loading}
        className="w-full rounded-full bg-[rgb(3_131_153)] hover:bg-[rgb(2_110_130)] text-white px-4 py-2.5 text-sm font-light transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing..." : "✦ Analyze journal"}
      </button>
    </div>
  </div>
);

export default JournalPicker;