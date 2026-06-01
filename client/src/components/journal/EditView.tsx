import { useState } from "react";
import type { Journal as JournalType } from "../../features/journal/journalTypes";

const MOOD_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  happy:   { bg: "bg-amber-50/60",  text: "text-amber-800",  dot: "bg-amber-400", border: "border-amber-200/50" },
  calm:    { bg: "bg-teal-50/60",   text: "text-teal-800",   dot: "bg-teal-400",  border: "border-teal-200/50" },
  neutral: { bg: "bg-slate-100/60", text: "text-slate-700",  dot: "bg-slate-400", border: "border-slate-200/50" },
  stressed:{ bg: "bg-rose-50/60",   text: "text-rose-800",   dot: "bg-rose-400",  border: "border-rose-200/50" },
  sad:     { bg: "bg-indigo-50/60", text: "text-indigo-800", dot: "bg-indigo-400", border: "border-indigo-200/50" },
};

const MOODS = ["happy", "calm", "neutral", "stressed", "sad"];

interface EditViewProps {
  journal: JournalType;
  onCancel: () => void;
  onSave: (data: { title: string; content: string; mood: string }) => void;
  saving: boolean;
}

const EditView = ({ journal, onCancel, onSave, saving }: EditViewProps) => {
  const [title, setTitle] = useState(journal.title || "");
  const [content, setContent] = useState(journal.content || "");
  const [mood, setMood] = useState(journal.mood || "neutral");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), content: content.trim(), mood });
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-0 flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          disabled={saving}
          className="rounded-full border border-white/50 bg-white/40 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light text-slate-800 transition-all hover:border-[rgb(3_131_153)] hover:bg-white/70 hover:text-[rgb(3_131_153)] shadow-sm flex items-center gap-1 disabled:opacity-50"
        >
          ← Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || !title.trim() || !content.trim()}
          className="rounded-full bg-[rgb(3_131_153)] hover:bg-[rgb(2_110_130)] text-white px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-light transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pt-6 flex-1 flex flex-col gap-4 pb-8">
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => {
            const colors = MOOD_COLORS[m];
            const active = mood === m;
            return (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`text-[11px] font-light px-3 py-1.5 rounded-full border backdrop-blur-sm transition-all
                  ${active
                    ? `${colors.bg} ${colors.text} ${colors.border} ring-1 ring-offset-1 ring-current`
                    : "bg-white/30 text-slate-600 border-white/40 hover:bg-white/50"
                  }`}
              >
                {m}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title…"
          className="w-full bg-white/30 backdrop-blur-sm border border-white/50 rounded-xl px-4 py-3 text-xl sm:text-2xl font-serif italic font-light text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[rgb(3_131_153)]/50 focus:bg-white/50 transition-all"
        />

        <div className="h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent" />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts…"
          rows={10}
          className="flex-1 w-full bg-white/30 backdrop-blur-sm border border-white/50 rounded-xl px-4 py-3 text-sm font-light leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[rgb(3_131_153)]/50 focus:bg-white/50 transition-all resize-none"
        />
      </div>
    </div>
  );
};

export default EditView;