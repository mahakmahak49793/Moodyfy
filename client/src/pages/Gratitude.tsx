import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createGratitude,
  getGratitudes,
  deleteGratitude,
  updateGratitude,
} from "../features/gratitude/gratitudeSlice";
import type { Gratitude } from "../features/gratitude/gratitudeTypes";
import MobileGratitudeSheet from "../components/gratitude/MobileGratitudeSheet";
import BackgroundImage from "../components/common/BackgroundImage";
import {DeleteModal} from "../components/common/DeleteModal";

// ─── helpers ──────────────────────────────────────────────────────────────────
const toDateKey = (d: string) => new Date(d).toLocaleDateString("en-CA");

const calcStreak = (gs: Gratitude[]) => {
  if (!gs.length) return 0;
  const days = [...new Set(gs.map(g => toDateKey(g.createdAt)))].sort((a,b)=>a>b?-1:1);
  let s = 1;
  for (let i = 0; i < days.length - 1; i++) {
    const diff = (new Date(days[i]).getTime() - new Date(days[i+1]).getTime()) / 86400000;
    if (diff === 1) s++; else break;
  }
  return s;
};

const PROMPTS = [
  "What made you smile today?",
  "Name someone who made this week softer…",
  "A tiny thing you almost missed noticing…",
  "Something in nature that caught your eye…",
  "A moment when you felt truly at ease…",
  "Who showed up for you recently?",
  "What felt like enough today?",
  "A kindness you gave or received…",
  "Something beautiful you saw but didn't photograph…",
  "One thing your body did well today…",
];

const CARD_ACCENT = [
  { dot: "bg-teal-400",   text: "text-teal-800",   ring: "ring-teal-200/60"   },
  { dot: "bg-amber-400",  text: "text-amber-800",  ring: "ring-amber-200/60"  },
  { dot: "bg-indigo-400", text: "text-indigo-800", ring: "ring-indigo-200/60" },
  { dot: "bg-rose-400",   text: "text-rose-800",   ring: "ring-rose-200/60"   },
];

// ─── EDIT MODAL FOR DESKTOP (Diary Style) ─────────────────────────────────────
const EditModal = ({ isOpen, onClose, gratitude, onSave }: { 
  isOpen: boolean; 
  onClose: () => void; 
  gratitude: Gratitude | null;
  onSave: (id: string, text: string) => void;
}) => {
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (gratitude) {
      setEditText(gratitude.text);
    }
  }, [gratitude]);

  const handleSave = () => {
    if (gratitude && editText.trim()) {
      onSave(gratitude._id, editText);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && gratitude && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              className="max-w-lg w-full bg-gradient-to-br from-teal-50 to-amber-50 rounded-2xl shadow-2xl overflow-hidden border border-teal-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Diary-style header */}
              <div className="relative bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-teal-400 to-amber-400" />
                <h3 className="font-serif text-2xl text-white text-center">Edit Feelings</h3>
                <p className="text-teal-100 text-xs text-center mt-1 font-serif italic">Revise your grateful moment</p>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/70 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-px bg-teal-300" />
                  <span className="mx-2 text-teal-400">✧</span>
                  <div className="w-12 h-px bg-teal-300" />
                </div>
                
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={6}
                  className="w-full p-4 bg-white/80 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 font-serif italic text-gray-700 text-base leading-relaxed"
                  placeholder="Edit your gratitude..."
                  autoFocus
                />
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-teal-300 rounded-xl text-teal-700 hover:bg-teal-50 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-medium shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
                
                <div className="flex justify-center mt-4">
                  <div className="text-xs text-teal-400 font-serif italic">✿ keep the warmth ✿</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── STREAK CALENDAR WITH BOTTOM SHEET ─────────────────────────────────────
const StreakCalendar = ({ gratitudes }: { gratitudes: Gratitude[] }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const writtenDays = useMemo(() => {
    const map = new Map<string, Gratitude[]>();
    gratitudes.forEach(g => {
      const key = toDateKey(g.createdAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(g);
    });
    return map;
  }, [gratitudes]);
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = new Date().toLocaleDateString("en-CA");
  const streak = calcStreak(gratitudes);
  const monthName = viewDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 });
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const key = new Date(year, month, i + 1).toLocaleDateString("en-CA");
    const entries = writtenDays.get(key) || [];
    return { 
      day: i + 1, 
      key, 
      isToday: key === todayKey, 
      hasEntry: entries.length > 0,
      entries 
    };
  });

  const handleDateClick = (key: string, entries: Gratitude[]) => {
    if (entries.length > 0) {
      setSelectedDate(key);
      if (isMobile) {
        setShowBottomSheet(true);
      } else {
        setShowModal(true);
      }
    }
  };

  const ModalContent = () => (
    <div className="space-y-4">
      {selectedDate && writtenDays.get(selectedDate)?.map((gratitude, idx) => (
        <div key={gratitude._id} className="bg-gradient-to-br from-teal-50 to-amber-50 rounded-xl p-4 border border-teal-200">
          <div className={`w-2 h-2 rounded-full ${CARD_ACCENT[idx % CARD_ACCENT.length].dot} mb-2`} />
          <p className="font-serif italic text-slate-700 text-base leading-relaxed">
            "{gratitude.text}"
          </p>
          <div className="mt-3 pt-2 border-t border-teal-200/50">
            <p className="font-mono text-[10px] text-teal-600">
              {new Date(gratitude.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-teal-300/30 bg-white/95 backdrop-blur-sm shadow-lg">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-teal-200/30">
          <div className="flex items-center gap-2 flex-wrap">
            <div>
              <p className="text-[9px] font-semibold tracking-widest text-teal-600 uppercase">Writing streak</p>
              <p className="text-sm font-light text-slate-700 font-serif italic">{monthName}</p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 border border-teal-300">
                <span className="text-xs">🔥</span>
                <span className="text-xs font-medium text-teal-800">{streak} {streak === 1 ? "day" : "days"}</span>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {[["‹", -1], ["›", 1]].map(([label, dir]) => (
              <button key={String(label)}
                onClick={() => setViewDate(new Date(year, month + Number(dir), 1))}
                className="w-6 h-6 rounded-full bg-teal-50 border border-teal-300 text-teal-700 hover:bg-teal-100 transition-all text-xs flex items-center justify-center"
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Day labels */}
        <div className="px-3 pt-2 grid grid-cols-7 gap-0.5">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} className="text-center text-[9px] font-semibold text-teal-600 uppercase">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="px-3 pt-1 pb-4 grid grid-cols-7 gap-1">
          {blanks.map((_, i) => <div key={`b${i}`} />)}
          {days.map(({ day, key, hasEntry, isToday, entries }) => (
            <motion.div
              key={day}
              whileHover={{ scale: hasEntry ? 1.1 : 1.05 }}
              onClick={() => handleDateClick(key, entries)}
              className={`relative aspect-square flex items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer ${
                hasEntry
                  ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md hover:shadow-lg"
                  : isToday
                  ? "bg-teal-100 text-teal-800 border-2 border-teal-400 hover:bg-teal-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {day}
              {hasEntry && (
                <span className="absolute -top-0.5 -right-0.5 text-[7px]">✨</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="px-4 pb-3 flex items-center gap-3 border-t border-teal-200/30 pt-2">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-[9px] text-slate-600">Has entries</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-teal-400 bg-teal-100" />
            <span className="text-[9px] text-slate-600">Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-300" />
            <span className="text-[9px] text-slate-600">No entries</span>
          </div>
        </div>
      </div>

      {/* Desktop Modal */}
      <AnimatePresence>
        {!isMobile && showModal && selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] bg-gradient-to-br from-teal-50 to-amber-50 border border-teal-300 rounded-xl shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-br from-teal-50 to-amber-50 border-b border-teal-200 px-5 py-4 flex items-center justify-between rounded-t-xl">
                <h3 className="font-serif text-lg text-slate-800">
                  {new Date(selectedDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-5">
                <ModalContent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet for Calendar */}
      <AnimatePresence>
        {isMobile && showBottomSheet && selectedDate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setShowBottomSheet(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
                <h3 className="font-serif text-lg text-slate-800">
                  {new Date(selectedDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </h3>
                <button
                  onClick={() => setShowBottomSheet(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-5">
                <ModalContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── DIARY WRITE AREA ─────────────────────────────────────────────────────
const DiaryWriteArea = ({
  onSubmit, loading, prompt, onClearPrompt,
}: {
  onSubmit: (t: string) => void;
  loading: boolean;
  prompt: string;
  onClearPrompt: () => void;
}) => {
  const [text, setText]     = useState("");
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const displayPrompt = prompt || PROMPTS[new Date().getDay() % PROMPTS.length];

  useEffect(() => { if (prompt) ref.current?.focus(); }, [prompt]);

  const submit = () => {
    const t = text.trim();
    if (!t || loading) return;
    onSubmit(t); setText(""); onClearPrompt();
  };

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden transition-all duration-400 ${
        focused ? "shadow-[0_0_0_2px_rgba(20,184,166,0.3),0_8px_32px_rgba(0,0,0,0.15)]" : "shadow-lg"
      }`}
      style={{
        background: "linear-gradient(145deg, #fffef8 0%, #fef9f0 50%, #fffbf5 100%)",
      }}
    >
      {/* Diary ruled lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-100">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute left-12 right-4 h-px"
            style={{ top: `${80 + i * 34}px`, background: "rgba(20,184,166,0.12)" }} />
        ))}
        <div className="absolute top-10 bottom-3 left-10 w-px" style={{ background: "rgba(251,113,133,0.2)" }} />
      </div>

      {/* Date top-right */}
      <div className="absolute top-3.5 right-4">
        <p className="font-mono text-[10px] text-gray-500">
          {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
        </p>
      </div>

      {/* Prompt */}
      <div className="px-5 pt-4 pb-1 flex items-center gap-2 min-h-[40px]">
        {prompt && <span className="text-sm flex-shrink-0">✨</span>}
        <p className={`font-serif italic text-sm leading-snug ${prompt ? "text-teal-700" : "text-gray-400"}`}>
          {displayPrompt}
        </p>
        {prompt && (
          <button onClick={onClearPrompt} className="ml-auto text-[10px] text-gray-400 hover:text-gray-600 flex-shrink-0">✕</button>
        )}
      </div>

      {/* Textarea - No character limit */}
      <div className="px-5 py-2 min-h-[160px]">
        <textarea
          ref={ref}
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Write anything — even the tiniest moment counts…"
          rows={6}
          className="w-full bg-transparent resize-none text-base font-light text-gray-800
            placeholder:text-gray-300 focus:outline-none leading-8 font-serif italic"
          style={{ caretColor: "#0d9488" }}
        />
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between border-t border-teal-100/50">
        
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {text.length > 0 && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setText("")}
                className="text-xs font-light text-gray-400 hover:text-gray-600 px-2 py-1">
                Clear
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={submit}
            disabled={!text.trim() || loading}
            className="rounded-full bg-teal-500/20 border border-teal-500/50 px-5 py-1.5
              text-sm font-medium text-teal-800 hover:bg-teal-500/30 transition-all
              disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {loading
              ? <><span className="w-2.5 h-2.5 rounded-full border border-teal-700/40 border-t-teal-700 animate-spin" />Saving…</>
              : "🌿 Keep this moment"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── GRATITUDE CARD WITH DELETE CONFIRMATION ─────────────────────────────
const GratitudeCard = ({
  gratitude, index, onEdit, isMobile, onDeleteClick,
}: {
  gratitude: Gratitude; index: number; onEdit: (g: Gratitude) => void;
  isMobile?: boolean; onDeleteClick: (g: Gratitude) => void;
}) => {
  const accent = CARD_ACCENT[index % CARD_ACCENT.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative rounded-xl bg-white/95 border border-teal-200/50 shadow-sm p-3 transition-all duration-300 hover:shadow-md hover:bg-white group"
    >
      <div className={`w-1.5 h-1.5 rounded-full ${accent.dot} mb-2`} />

      <p className="font-serif italic text-sm leading-relaxed text-gray-800 mb-2 line-clamp-3">
        "{gratitude.text}"
      </p>

      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent my-2" />

      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] font-medium text-gray-500">
          {new Date(gratitude.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          {" · "}
          {new Date(gratitude.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </p>

        {/* Icons - Always visible on mobile, on hover on desktop */}
        <div className={`flex gap-1 ${!isMobile ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-200' : ''}`}>
          <button 
            onClick={() => onEdit(gratitude)}
            className="text-xs text-gray-400 hover:text-teal-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDeleteClick(gratitude)}
            className="text-xs text-gray-400 hover:text-rose-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MEMORY SURFACER ─────────────────────────────────────────────────
const MemorySurface = ({ gratitudes }: { gratitudes: Gratitude[] }) => {
  const [memory, setMemory]   = useState<Gratitude | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const openRandomMemory = () => {
    if (isOpening || gratitudes.length === 0) return;
    setIsOpening(true);
    setShowDetails(false);
    setMemory(null);
    
    setTimeout(() => {
      const oldMemories = gratitudes.filter(g =>
        (Date.now() - new Date(g.createdAt).getTime()) / 86400000 > 3
      );
      const pool = oldMemories.length ? oldMemories : gratitudes;
      const randomMemory = pool[Math.floor(Math.random() * pool.length)];
      setMemory(randomMemory);
      setIsOpening(false);
      
      setTimeout(() => setShowDetails(true), 300);
    }, 500);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const getDaysAgo = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    return diffDays;
  };

  if (gratitudes.length === 0) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-amber-50 border border-teal-200 p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-teal-700 uppercase flex items-center gap-2">
            <span>📖</span> From the past
          </p>
          <p className="text-xs font-light text-gray-600 mt-0.5">Rediscover a moment you once cherished</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openRandomMemory}
          disabled={isOpening}
          className="flex items-center gap-2 text-sm font-medium text-teal-700 bg-white/80 border border-teal-300 px-4 py-2 rounded-full hover:bg-teal-50 transition-all disabled:opacity-50 shadow-sm"
        >
          <motion.span 
            animate={{ rotate: isOpening ? 360 : 0 }} 
            transition={{ duration: 0.6, repeat: isOpening ? Infinity : 0 }}
            className="text-base"
          >
            🕰️
          </motion.span>
          {isOpening ? "Opening..." : "Open a memory"}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {memory && showDetails ? (
          <motion.div
            key={memory._id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -top-2 -left-2 text-2xl opacity-20">"</div>
            <div className="absolute -bottom-2 -right-2 text-2xl opacity-20">"</div>
            
            <div className="bg-white rounded-xl p-5 border border-teal-200 shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm">
                  📜
                </div>
                <div>
                  <p className="text-xs font-semibold text-teal-700">A memory surfaces</p>
                  <p className="text-[10px] text-gray-500">{formatDate(memory.createdAt)}</p>
                </div>
              </div>
              
              <p className="font-serif italic text-gray-700 text-base leading-relaxed mb-4">
                {memory.text}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-teal-100">
                <div className="flex items-center gap-1">
                  <span className="text-xs">✨</span>
                  <span className="text-[10px] text-teal-600 font-medium">
                    {new Date(memory.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="text-[10px] text-amber-600">
                  {getDaysAgo(memory.createdAt)} days ago
                </div>
              </div>
            </div>
            
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={openRandomMemory}
              className="absolute -bottom-3 right-4 bg-teal-500 text-white rounded-full p-2 shadow-lg hover:bg-teal-600 transition-all"
            >
              <span className="text-xs">🎲</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="text-4xl mb-3 opacity-50">📖</div>
            <p className="text-sm font-serif italic text-gray-500">
              {gratitudes.length === 0 
                ? "Write your first gratitude to unlock memories..." 
                : "Press 'Open a memory' to revisit something beautiful from your journey..."}
            </p>
            {gratitudes.length > 0 && (
              <div className="mt-3 flex justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-teal-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const GratitudePage = () => {
  const dispatch = useAppDispatch();
  const { gratitudes, loading, error } = useAppSelector((state: any) => state.gratitude);
  const [prompt, setPrompt]           = useState("");
  const [showAll, setShowAll]         = useState(false);
  const [editingGratitude, setEditingGratitude] = useState<Gratitude | null>(null);
  const [deletingGratitude, setDeletingGratitude] = useState<Gratitude | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [updating, setUpdating] = useState(false);
  const INITIAL_SHOW = 3;

  useEffect(() => {
    dispatch(getGratitudes());
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  const handleUpdateGratitude = async (id: string, text: string) => {
    setUpdating(true);
    try {
      await dispatch(updateGratitude({ id, text }));
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteGratitude = () => {
    if (deletingGratitude) {
      dispatch(deleteGratitude(deletingGratitude._id));
      setDeletingGratitude(null);
    }
  };

  const visible   = showAll ? gratitudes : gratitudes.slice(0, INITIAL_SHOW);
  const hasMore   = gratitudes.length > INITIAL_SHOW;
  const streak    = useMemo(() => calcStreak(gratitudes), [gratitudes]);
  const todayCount = useMemo(() =>
    gratitudes.filter((g: Gratitude) => toDateKey(g.createdAt) === new Date().toLocaleDateString("en-CA")).length,
    [gratitudes]
  );

  return (
    <>
      <BackgroundImage />

      <div className="w-full min-h-screen font-serif">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center lg:text-left"
          >
            <p className="text-xs font-semibold tracking-widest text-teal-200/90 uppercase mb-2 flex items-center justify-center lg:justify-start gap-2">
              <span className="inline-block w-4 h-px bg-teal-400/60" />
              Gratitude diary
            </p>
            <h1
              className="font-serif italic font-light text-white leading-tight mb-3 drop-shadow-sm text-center lg:text-left"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)" }}
            >
              Your personal collection of small beautiful moments
            </h1>
            <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
              {streak > 0 && (
                <span className="text-sm font-medium text-teal-200/90 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full">
                  🔥 {streak} day streak
                </span>
              )}
              {todayCount > 0 && (
                <span className="text-sm font-medium text-white/70 bg-white/15 border border-white/20 px-3 py-1 rounded-full">
                  ✨ {todayCount} written today
                </span>
              )}
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-5">
              {/* Diary write area */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <DiaryWriteArea
                  onSubmit={t => dispatch(createGratitude(t))}
                  loading={loading}
                  prompt={prompt}
                  onClearPrompt={() => setPrompt("")}
                />
              </motion.div>

              {error && (
                <p className="text-sm text-rose-500 font-light text-center bg-white/80 rounded-lg p-2">{error}</p>
              )}

              {/* On mobile, calendar appears after write area */}
              <div className="lg:hidden">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <StreakCalendar gratitudes={gratitudes} />
                </motion.div>
              </div>

              {/* Recent entries */}
              {gratitudes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <p className="text-xs font-semibold tracking-widest text-teal-700 uppercase mb-3 flex items-center gap-2">
                    <span className="inline-block w-4 h-px bg-teal-500" />
                    Recent moments
                    <span className="text-[10px] font-normal text-gray-500">
                      ({gratitudes.length} total)
                    </span>
                  </p>

                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {visible.map((g: Gratitude, i: number) => (
                        <GratitudeCard
                          key={g._id}
                          gratitude={g}
                          index={i}
                          onEdit={setEditingGratitude}
                          isMobile={isMobile}
                          onDeleteClick={setDeletingGratitude}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {hasMore && (
                    <div className="mt-4 flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAll(v => !v)}
                        className="rounded-full border border-teal-300 bg-white/90 backdrop-blur-sm
                          px-5 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50
                          transition-all flex items-center gap-2 shadow-sm"
                      >
                        {showAll
                          ? "🌿 Show less"
                          : `✨ View all ${gratitudes.length} moments`}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Empty state */}
              {gratitudes.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-white/90 backdrop-blur-sm border border-teal-200 p-8 text-center shadow-lg"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-4xl mb-3"
                  >🌸</motion.div>
                  <p className="font-serif italic font-light text-gray-700 text-base mb-2">
                    This page is waiting for you.
                  </p>
                  <p className="text-sm font-light text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Start with something tiny — even "the coffee was warm" is a moment worth keeping.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Right Column - Desktop only */}
            <div className="hidden lg:block lg:col-span-4 space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StreakCalendar gratitudes={gratitudes} />
              </motion.div>

              {gratitudes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <MemorySurface gratitudes={gratitudes} />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="rounded-2xl bg-white/90 border border-teal-200 p-4 text-center shadow-md"
              >
                <p className="text-xl mb-2">🌿</p>
                <p className="font-serif italic font-light text-gray-600 text-xs leading-relaxed">
                  Gratitude doesn't erase hard days — it helps you notice that good ones exist too.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Mobile Memory Surface - shown after recent moments */}
          {isMobile && gratitudes.length > 0 && (
            <div className="mt-5">
              <MemorySurface gratitudes={gratitudes} />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal for Desktop */}
      {!isMobile && (
        <EditModal
          isOpen={!!editingGratitude}
          onClose={() => setEditingGratitude(null)}
          gratitude={editingGratitude}
          onSave={handleUpdateGratitude}
        />
      )}

      {/* Edit Bottom Sheet for Mobile */}
      {isMobile && (
        <MobileGratitudeSheet
          gratitude={editingGratitude}
          onClose={() => setEditingGratitude(null)}
          onSave={handleUpdateGratitude}
          loading={updating}
        />
      )}

      {/* Delete Confirmation Modal - Using shared component */}
      <DeleteModal
        isOpen={!!deletingGratitude}
        onClose={() => setDeletingGratitude(null)}
        onConfirm={handleDeleteGratitude}
        loading={false}
      />
    </>
  );
};

export default GratitudePage;