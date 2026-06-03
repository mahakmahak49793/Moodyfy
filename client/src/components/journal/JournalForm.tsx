import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  analyzeJournal,
  createJournal,
} from "../../features/journal/journalSlice";
import { MenuIcon, Mic, MicOff } from "lucide-react";
import { useSpeechToText } from "../../app/useSpeechToText";

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
  const { isListening, error, startListening, stopListening } = useSpeechToText();

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setContent((prev) => prev ? prev + " " + transcript : transcript);
      });
    }
  };

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

      {/* Mobile sidebar toggle */}
      <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden rounded-full border border-white/50 bg-white/30 backdrop-blur-sm px-3 py-2 text-xs font-light text-white transition-all hover:border-[rgb(3_131_153)] hover:bg-white/40 shadow-sm flex items-center gap-1"
        >
          <MenuIcon size={14} />
          {journalsCount} Journals
        </button>
      </div>

      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-4 pb-0 flex justify-between items-start gap-4">
        <p
          className="font-serif italic font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
          style={{ fontSize: "1.35rem", letterSpacing: "-0.01em" }}
        >
          New Reflection
        </p>

        {/* Save button only */}
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

      {/* Mood chips */}
      <div className="px-4 sm:px-6 md:px-8 mt-6 mb-6 flex gap-2 flex-wrap">
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

      {/* Title input */}
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

     {/* Textarea with mic inside */}
<div className="px-4 sm:px-6 md:px-8 flex-1 pb-6">
  <div
    className={`relative rounded-2xl border transition-all duration-200 ${
      isListening
        ? "border-rose-400/60 bg-white/20"
        : "border-white/30 bg-white/15"
    } backdrop-blur-sm`}
  >
    {/* Mic button — top right */}
    <div className="absolute top-3 right-3 z-10">
      <button
        onClick={handleMicClick}
        title={isListening ? "Stop recording" : "Speak to write"}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all backdrop-blur-sm ${
          isListening
            ? "bg-rose-500/90 text-white animate-pulse"
            : "bg-white/40 border border-white/50 text-slate-700 hover:bg-white/60"
        }`}
      >
        {isListening ? <MicOff size={13} /> : <Mic size={13} />}
        {/* Text label — desktop only */}
        <span className="hidden sm:inline">
          {isListening ? "Stop" : "Speak"}
        </span>
      </button>
    </div>

    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Start expressing yourself…"
      rows={10}
      className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-600/60 text-sm font-light leading-relaxed resize-none px-4 pt-4 pb-10 pr-16 sm:pr-32"
    />

    {/* Bottom bar — character count only */}
    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center border-t border-white/20 rounded-b-2xl">
      <span className="font-mono text-[10px] text-slate-500">
        {content.length} characters
      </span>
    </div>
  </div>

  {error && (
    <p className="mt-2 text-xs text-rose-300">{error}</p>
  )}
</div>

    </div>
  );
};

export default JournalForm;