import type { Journal as JournalType } from "../../features/journal/journalTypes";
import Sidebar from "../layout/Sidebar";

const MOOD_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  happy:   { bg: "bg-amber-50/60",  text: "text-amber-800",  dot: "bg-amber-400", border: "border-amber-200/50" },
  calm:    { bg: "bg-teal-50/60",   text: "text-teal-800",   dot: "bg-teal-400",  border: "border-teal-200/50" },
  neutral: { bg: "bg-slate-100/60", text: "text-slate-700",  dot: "bg-slate-400", border: "border-slate-200/50" },
  stressed:{ bg: "bg-rose-50/60",   text: "text-rose-800",   dot: "bg-rose-400",  border: "border-rose-200/50" },
  sad:     { bg: "bg-indigo-50/60", text: "text-indigo-800", dot: "bg-indigo-400", border: "border-indigo-200/50" },
};

const SidebarEntry = ({
  journal,
  active,
  onClick,
}: {
  journal: JournalType;
  active: boolean;
  onClick: () => void;
}) => {
  const mood = MOOD_COLORS[journal.mood] ?? MOOD_COLORS.neutral;
  return (
    <div
      onClick={onClick}
      className={`px-4 sm:px-5 py-3 sm:py-4 cursor-pointer transition-all duration-200 ${
        active
          ? "bg-[rgb(3_131_153/0.15)] border-l-4 border-[rgb(3_131_153)] backdrop-blur-sm"
          : "border-l-4 border-transparent hover:bg-white/20 backdrop-blur-sm"
      }`}
    >
      <p className="font-mono text-[10px] text-slate-600 mb-1.5 tracking-wider">
        {new Date(journal.createdAt).toLocaleDateString("en-GB", {
          day: "numeric", month: "short", year: "numeric",
        })}
      </p>
      <p className="text-[13px] sm:text-[14px] font-light text-slate-800 truncate flex items-center gap-2">
        <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${mood.dot}`} />
        {journal.title || "Untitled"}
      </p>
      <p className="text-[11px] sm:text-[12px] font-light text-slate-600 truncate mt-1">
        {journal.content.slice(0, 60)}...
      </p>
    </div>
  );
};

interface JournalSidebarProps {
  journals: JournalType[];
  activeJournalId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEntryClick: (journal: JournalType) => void;
}

const JournalSidebar = ({
  journals,
  activeJournalId,
  isOpen,
  onClose,
  onEntryClick,
}: JournalSidebarProps) => {
  return (
    <Sidebar
      title="Journal Entries"
      subtitle={`${journals.length} ${journals.length === 1 ? "entry" : "entries"} total`}
      isOpen={isOpen}
      onClose={onClose}
    >
      {journals.length === 0 ? (
        <div className="px-4 sm:px-6 py-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-sm font-light text-white/80 drop-shadow-sm">No entries yet</p>
          <p className="text-xs font-light text-white/60 mt-2 drop-shadow-sm">Start writing your first reflection →</p>
        </div>
      ) : (
        journals.map((journal) => (
          <SidebarEntry
            key={journal._id}
            journal={journal}
            active={activeJournalId === journal._id}
            onClick={() => onEntryClick(journal)}
          />
        ))
      )}
    </Sidebar>
  );
};

export default JournalSidebar;