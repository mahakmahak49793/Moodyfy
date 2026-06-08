import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onSave: (text: string, mood?: string) => Promise<void>;
  loading?: boolean;
  onNavigateToFull?: () => void;
}

const MOODS = [
  { label: "Peaceful", emoji: "🌿", dot: "bg-teal-400", value: "calm" },
  { label: "Grateful", emoji: "✨", dot: "bg-amber-400", value: "happy" },
  { label: "Anxious",  emoji: "🌊", dot: "bg-rose-400", value: "stressed" },
  { label: "Joyful",   emoji: "☀️", dot: "bg-amber-400", value: "happy" },
  { label: "Tired",    emoji: "🌙", dot: "bg-indigo-400", value: "sad" },
];

const PROMPTS = [
  "What's weighing on your heart today?",
  "Describe how your day felt in three words…",
  "What moment today would you like to hold on to?",
  "What are you learning about yourself lately?",
  "What would make tomorrow feel lighter?",
];

const QuickJournal = ({ onSave, loading, onNavigateToFull }: Props) => {
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [showMoodWarning, setShowMoodWarning] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const prompt = PROMPTS[new Date().getDay() % PROMPTS.length];

  const handleSave = async () => {
    const t = text.trim();
    
    // Check if mood is selected
    if (selectedMood === null) {
      setShowMoodWarning(true);
      setTimeout(() => setShowMoodWarning(false), 2000);
      return;
    }
    
    if (!t || loading) return;
    
    const mood = MOODS[selectedMood].value;
    await onSave(t, mood);
    setText("");
    setSelectedMood(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Check if save should be disabled
  const isSaveDisabled = !text.trim() || loading || selectedMood === null;

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
        focused
          ? "shadow-[0_0_0_2px_rgba(20,184,166,0.3),0_8px_32px_rgba(0,0,0,0.15)]"
          : "shadow-lg"
      }`}
      style={{
        background: "linear-gradient(145deg, #fffef8 0%, #fef9f0 50%, #fffbf5 100%)",
      }}
    >
      {/* Diary ruled lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute left-12 right-4 h-px"
            style={{
              top: `${90 + i * 34}px`,
              background: "rgba(20,184,166,0.10)",
            }}
          />
        ))}
        <div
          className="absolute top-10 bottom-3 left-10 w-px"
          style={{ background: "rgba(251,113,133,0.18)" }}
        />
      </div>

      <div className="px-5 pt-4 pb-2">
        <div className="flex items-start justify-between">
          
          {/* Left Side */}
          <div className="flex-1 pr-4">
            <p className="text-[9px] font-semibold tracking-widest text-teal-600 uppercase">
              TODAY'S WHISPER
            </p>
            <p className="font-serif italic text-sm text-gray-500 leading-relaxed mt-1">
              {prompt}
            </p>
          </div>

          {/* Right Side: Button + Date */}
          <div className="flex flex-col items-end gap-2">
            {onNavigateToFull && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHoveringNav(true)}
                onHoverEnd={() => setIsHoveringNav(false)}
                onClick={onNavigateToFull}
                className="relative group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200/50 hover:border-teal-300/70 transition-all duration-300 shadow-sm"
              >
                <motion.span
                  animate={{
                    rotate: isHoveringNav ? [0, 15, -10, 15, 0] : 0,
                    scale: isHoveringNav ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-base"
                >
                  ✨
                </motion.span>
                
                <span className="text-xs font-medium bg-gradient-to-r from-amber-700 to-teal-700 bg-clip-text text-transparent">
                  {isHoveringNav ? "Pour your heart out" : "Deep journal"}
                </span>
              </motion.button>
            )}

            {/* Date below button */}
            <p className="font-mono text-[10px] text-gray-400 tracking-wide">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Mood pills with subtle required indicator */}
      <div className="px-5 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-mono text-teal-500/70 uppercase tracking-wider">
            How are you feeling? <span className="text-rose-400">*</span>
          </p>
          {selectedMood === null && text.trim() && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9px] font-mono text-amber-500"
            >
              Select a mood to save
            </motion.p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map((m, i) => (
            <button
              key={m.label}
              onClick={() => {
                setSelectedMood(i === selectedMood ? null : i);
                setShowMoodWarning(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-light border transition-all duration-200 ${
                selectedMood === i
                  ? "border-teal-400 bg-teal-50 text-teal-700 shadow-sm"
                  : "border-gray-200 text-gray-500 hover:border-teal-300 hover:bg-teal-50/50"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
        
        {/* Mood warning message */}
        <AnimatePresence>
          {showMoodWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-1.5 text-amber-600 text-xs"
            >
              <span>⚠️</span>
              <span>Please select how you're feeling before saving</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Textarea */}
      <div className="px-5 py-2 min-h-[140px]">
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Today I felt…"
          rows={5}
          className="w-full bg-transparent resize-none text-sm font-light text-gray-800 placeholder:text-gray-300 focus:outline-none leading-8 font-serif italic"
          style={{ caretColor: "#0d9488" }}
        />
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between border-t border-teal-100/50">
        <div className="text-[10px] font-mono text-gray-400">
          {text.length > 0 ? `${text.length} characters` : "Write freely ✍️"}
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {text.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setText(""); setSelectedMood(null); setShowMoodWarning(false); }}
                className="text-xs font-light text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Clear
              </motion.button>
            )}
          </AnimatePresence>

          <div className="relative">
            <motion.button
              whileHover={!isSaveDisabled ? { scale: 1.02 } : {}}
              whileTap={!isSaveDisabled ? { scale: 0.97 } : {}}
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5 ${
                isSaveDisabled
                  ? "bg-gray-200/50 border border-gray-300/50 text-gray-400 cursor-not-allowed"
                  : "bg-teal-500/20 border border-teal-500/50 text-teal-800 hover:bg-teal-500/30"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full border border-teal-700/40 border-t-teal-700 animate-spin" />
                  Saving…
                </>
              ) : saved ? (
                "✓ Saved"
              ) : (
                "🌿 Save entry"
              )}
            </motion.button>
            
            {/* Tooltip for disabled state */}
            {isSaveDisabled && !loading && !saved && selectedMood === null && text.trim() && (
              <div className="absolute -top-8 right-0 whitespace-nowrap bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none">
                Select a mood first
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickJournal;