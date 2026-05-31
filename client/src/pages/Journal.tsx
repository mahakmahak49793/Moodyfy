import { useEffect, useState } from "react";
import JournalForm from "../components/journal/JournalForm";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getJournals } from "../features/journal/journalSlice";
import type { Journal as JournalType } from "../features/journal/journalTypes";
import { useLocation } from "react-router-dom"; // 👈 added

const MOOD_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  happy:   { bg: "bg-amber-50/60",  text: "text-amber-800",  dot: "bg-amber-400", border: "border-amber-200/50" },
  calm:    { bg: "bg-teal-50/60",   text: "text-teal-800",   dot: "bg-teal-400",  border: "border-teal-200/50" },
  neutral: { bg: "bg-slate-100/60", text: "text-slate-700",  dot: "bg-slate-400", border: "border-slate-200/50" },
  stressed:{ bg: "bg-rose-50/60",   text: "text-rose-800",   dot: "bg-rose-400",  border: "border-rose-200/50" },
  sad:     { bg: "bg-indigo-50/60", text: "text-indigo-800", dot: "bg-indigo-400", border: "border-indigo-200/50" },
};

const ReadView = ({
  journal,
  onBack,
}: {
  journal: JournalType;
  onBack: () => void;
}) => {
  const mood = MOOD_COLORS[journal.mood] ?? MOOD_COLORS.neutral;
  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-0 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="rounded-full border border-white/50 bg-white/40 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light text-slate-800 transition-all hover:border-[rgb(3_131_153)] hover:bg-white/70 hover:text-[rgb(3_131_153)] shadow-sm flex items-center gap-1"
        >
          ← Back
        </button>
        <button
          onClick={onBack}
          className="rounded-full border border-white/50 bg-white/40 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light text-slate-800 transition-all hover:border-[rgb(3_131_153)] hover:bg-white/70 hover:text-[rgb(3_131_153)] shadow-sm whitespace-nowrap flex items-center gap-1"
        >
          New
        </button>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pt-4">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className={`text-[11px] font-light px-3 py-1.5 rounded-full ${mood.bg} ${mood.text} border ${mood.border} backdrop-blur-sm`}>
            {journal.mood}
          </span>
          <span className="font-mono text-[11px] text-slate-600 bg-white/30 backdrop-blur-sm px-2 py-1 rounded">
            {new Date(journal.createdAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>
      </div>

      <h2 className="px-4 sm:px-6 md:px-8 text-2xl sm:text-3xl md:text-[32px] leading-tight text-slate-800 mb-4 font-serif font-light italic drop-shadow-sm">
        {journal.title || "Untitled"}
      </h2>

      <div className="mx-4 sm:mx-6 md:mx-8 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent mb-6" />

      <p className="px-4 sm:px-6 md:px-8 flex-1 text-sm font-light leading-relaxed text-slate-700 pb-6">
        {journal.content}
      </p>
    </div>
  );
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

const Journal = () => {
  const dispatch = useAppDispatch();
  const { journals } = useAppSelector((state: any) => state.journal);
  const [activeJournal, setActiveJournal] = useState<JournalType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // 👈 added

  useEffect(() => {
    dispatch(getJournals());
  }, [dispatch]);

  // 👇 Auto-open entry when navigated from CalendarStreak
  useEffect(() => {
    const entryId = location.state?.entryId;
    if (entryId && journals.length > 0) {
      const match = journals.find((j: JournalType) => j._id === entryId);
      if (match) setActiveJournal(match);
    }
  }, [journals, location.state]); // 👈 runs whenever journals load or location state changes

  useEffect(() => {
    if (activeJournal) {
      const updated = journals.find((j: JournalType) => j._id === activeJournal._id);
      if (updated) setActiveJournal(updated);
    }
  }, [journals]);

  const handleEntryClick = (journal: JournalType) => {
    setActiveJournal(journal);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(2, 28, 38, 0.55) 0%,
              rgba(3, 60, 80, 0.35) 30%,
              rgba(240, 249, 255, 0.82) 65%,
              rgba(240, 253, 250, 0.92) 100%
            ),
            url('https://img.freepik.com/premium-photo/calm-ocean-moody-sky_1179475-44119.jpg?semt=ais_hybrid&w=740&q=80')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="w-full min-h-screen font-serif">
        <div className="flex w-full min-h-screen">
          <aside
            className={`
              fixed lg:relative z-40
              w-72 sm:w-80
              h-full transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              flex flex-col bg-white/20 backdrop-blur-md border-r border-white/30
              shadow-xl lg:shadow-none
            `}
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 z-50 text-slate-600 hover:text-slate-800 bg-white/20 rounded-full p-1.5 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="border-b border-white/30 px-4 sm:px-6 py-5 sm:py-6">
              <h1
                className="font-serif italic font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] mb-1"
                style={{ fontSize: "1.45rem", letterSpacing: "-0.01em", lineHeight: 1.2 }}
              >
                Journal Entries
              </h1>
              <p className="text-xs font-light text-white/80 drop-shadow mt-1">
                {journals.length} {journals.length === 1 ? "entry" : "entries"} total
              </p>
            </div>

            <div className="flex-1 overflow-y-auto py-3">
              {journals.length === 0 ? (
                <div className="px-4 sm:px-6 py-12 text-center">
                  <p className="text-sm font-light text-slate-700 drop-shadow-sm">No entries yet.</p>
                  <p className="text-xs font-light text-slate-600 mt-2 drop-shadow-sm">Start your first reflection →</p>
                </div>
              ) : (
                journals.map((j: JournalType) => (
                  <SidebarEntry
                    key={j._id}
                    journal={j}
                    active={activeJournal?._id === j._id}
                    onClick={() => handleEntryClick(j)}
                  />
                ))
              )}
            </div>
          </aside>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className="flex-1 flex flex-col bg-transparent min-h-screen">
            {activeJournal ? (
              <ReadView
                journal={activeJournal}
                onBack={() => setActiveJournal(null)}
              />
            ) : (
              <JournalForm
                journalsCount={journals.length}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Journal;