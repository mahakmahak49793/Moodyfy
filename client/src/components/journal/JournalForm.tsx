import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  analyzeJournal,
  createJournal,
} from "../../features/journal/journalSlice";
import { MenuIcon } from "lucide-react";

const MOODS = [
  { label: "Peaceful", dot: "bg-teal-400", value: "calm" },
  { label: "Grateful", dot: "bg-amber-400", value: "happy" },
  { label: "Anxious", dot: "bg-rose-400", value: "stressed" },
  { label: "Joyful", dot: "bg-amber-400", value: "happy" },
  { label: "Tired", dot: "bg-indigo-400", value: "sad" },
];

interface JournalFormProps {
  journalsCount?: number;
  onToggleSidebar: () => void;
}

const JournalForm = ({
  journalsCount = 0,
  onToggleSidebar,
}: JournalFormProps) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("calm");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const resultAction = await dispatch(
      createJournal({
        title: title || content.slice(0, 50),
        content,
        mood,
      }),
    );

    if (createJournal.fulfilled.match(resultAction)) {
      const journalId = resultAction.payload.journal._id;
      dispatch(analyzeJournal(journalId));
      setTitle("");
      setContent("");
      setMood("calm");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 ">
        {/* Your Entries Button - visible ONLY on mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden rounded-full border border-white/50 bg-white/30 backdrop-blur-sm px-3 py-2 text-xs font-light text-white transition-all hover:border-[rgb(3_131_153)] hover:bg-white/40 shadow-sm flex items-center gap-1"
        >
          <MenuIcon size={14} />
          {journalsCount} Journals
        </button>
      </div>
      {/* Header with New Reflection heading and buttons on top right */}
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-0 flex justify-between items-start gap-4">
        <p
          className="font-serif italic font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
          style={{ fontSize: "1.35rem", letterSpacing: "-0.01em" }}
        >
          New Reflection
        </p>

        {/* Right side buttons container */}
        <div className="flex gap-2">
          {/* Save Entry Button - on top right */}
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className={`rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-all active:scale-95 backdrop-blur-sm shadow-sm whitespace-nowrap ${
              saved
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-[rgb(3,131,153)] text-white hover:bg-[rgb(2,100,120)] disabled:opacity-40"
            }`}
          >
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Mood chips */}
      <div className="px-4 sm:px-6 md:px-8 mt-6 mb-8 flex gap-2 flex-wrap">
        {MOODS.map((m) => (
          <button
            key={m.label}
            onClick={() => setMood(m.value)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 backdrop-blur-sm border ${
              mood === m.value
                ? "border-[rgb(3_131_153)] bg-[rgb(3_131_153/0.25)] text-white drop-shadow"
                : "border-white/50 bg-white/25 text-white/90 hover:border-white/70 hover:bg-white/35"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
            {m.label}
          </button>
        ))}
      </div>

      {/* Title — italic, transparent */}
      <div className="px-4 sm:px-6 md:px-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What will you call this moment…"
          maxLength={80}
          className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-700/90 text-xl sm:text-2xl md:text-[28px] leading-snug mb-3 font-serif font-light italic"
        />
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent mb-6" />
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 md:px-8 flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Begin writing. No pressure, just you…"
          rows={12}
          className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-700/70 text-sm font-light leading-relaxed resize-none"
        />
      </div>

      {/* Footer — character count only */}
      <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 border-t border-white/30 flex items-center mt-auto">
        <span className="font-mono text-[10px] sm:text-[11px] text-slate-600 drop-shadow-sm">
          {content.length} characters
        </span>
      </div>
    </div>
  );
};

export default JournalForm;
