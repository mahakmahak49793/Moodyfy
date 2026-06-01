import { useState } from "react";
import type { Journal as JournalType } from "../../features/journal/journalTypes";

const MOOD_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  happy:   { bg: "bg-amber-50/60",  text: "text-amber-800",  dot: "bg-amber-400", border: "border-amber-200/50" },
  calm:    { bg: "bg-teal-50/60",   text: "text-teal-800",   dot: "bg-teal-400",  border: "border-teal-200/50" },
  neutral: { bg: "bg-slate-100/60", text: "text-slate-700",  dot: "bg-slate-400", border: "border-slate-200/50" },
  stressed:{ bg: "bg-rose-50/60",   text: "text-rose-800",   dot: "bg-rose-400",  border: "border-rose-200/50" },
  sad:     { bg: "bg-indigo-50/60", text: "text-indigo-800", dot: "bg-indigo-400", border: "border-indigo-200/50" },
};

interface ReadViewProps {
  journal: JournalType;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ReadView = ({ journal, onBack, onEdit, onDelete }: ReadViewProps) => {
  const mood = MOOD_COLORS[journal.mood] ?? MOOD_COLORS.neutral;
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-0 flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={onBack}
          className="rounded-full border border-white/50 bg-white/40 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light text-slate-800 transition-all hover:border-[rgb(3_131_153)] hover:bg-white/70 hover:text-[rgb(3_131_153)] shadow-sm flex items-center gap-1"
        >
          ← Back
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onEdit}
            className="rounded-full border border-white/50 bg-white/40 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light text-slate-800 transition-all hover:border-[rgb(3_131_153)] hover:bg-white/70 hover:text-[rgb(3_131_153)] shadow-sm flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
            </svg>
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-full border border-white/50 bg-white/40 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light text-rose-700 transition-all hover:border-rose-400 hover:bg-rose-50/60 shadow-sm flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <button
            onClick={onBack}
            className="rounded-full border border-white/50 bg-white/40 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light text-slate-800 transition-all hover:border-[rgb(3_131_153)] hover:bg-white/70 hover:text-[rgb(3_131_153)] shadow-sm whitespace-nowrap"
          >
            New
          </button>
        </div>
        
        <div className="sm:hidden relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full border border-white/50 bg-white/40 backdrop-blur-sm p-2 text-slate-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/50 py-2 min-w-[140px]">
                <button
                  onClick={() => { onEdit(); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-slate-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                <div className="h-px bg-slate-200 my-1" />
                <button
                  onClick={() => { onBack(); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 4v16m8-8H4" />
                  </svg>
                  New Entry
                </button>
              </div>
            </>
          )}
        </div>
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

      <p className="px-4 sm:px-6 md:px-8 flex-1 text-sm font-light leading-relaxed text-slate-700 pb-6 whitespace-pre-wrap">
        {journal.content}
      </p>
    </div>
  );
};

export default ReadView;