import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JournalEntry {
  _id: string;
  text: string;
  mood?: string;
  createdAt: string;
}

interface Props {
  entries: JournalEntry[];
  onNavigateToEntry?: (entryId: string) => void;
}

const toDateKey = (d: string) => new Date(d).toLocaleDateString("en-CA");

const calcStreak = (entries: JournalEntry[]) => {
  if (!entries.length) return 0;
  const days = [...new Set(entries.map((e) => toDateKey(e.createdAt)))].sort(
    (a, b) => (a > b ? -1 : 1)
  );
  let s = 1;
  for (let i = 0; i < days.length - 1; i++) {
    const diff =
      (new Date(days[i]).getTime() - new Date(days[i + 1]).getTime()) /
      86400000;
    if (diff === 1) s++;
    else break;
  }
  return s;
};

const CalendarStreak = ({ entries, onNavigateToEntry }: Props) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const writtenDays = useMemo(() => {
    const map = new Map<string, JournalEntry[]>();
    entries.forEach((e) => {
      const key = toDateKey(e.createdAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [entries]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = new Date().toLocaleDateString("en-CA");
  const streak = calcStreak(entries);
  const monthName = viewDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 });

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const key = new Date(year, month, i + 1).toLocaleDateString("en-CA");
    const dayEntries = writtenDays.get(key) || [];
    return {
      day: i + 1,
      key,
      isToday: key === todayKey,
      hasEntry: dayEntries.length > 0,
      entries: dayEntries,
    };
  });

  const handleDateClick = (key: string, dayEntries: JournalEntry[]) => {
    if (!dayEntries.length) return;

    // Single entry → navigate directly
    if (dayEntries.length === 1) {
      onNavigateToEntry?.(dayEntries[0]._id);
      return;
    }

    // Multiple entries → show picker modal
    setSelectedDate(key);
    setShowModal(true);
  };

  const handleEntryClick = (entryId: string) => {
    setShowModal(false);
    setSelectedDate(null);
    onNavigateToEntry?.(entryId);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-teal-300/30 bg-white/90 backdrop-blur-sm shadow-lg">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-teal-200/30">
          <div className="flex items-center gap-2 flex-wrap">
            <div>
              <p className="text-[9px] font-semibold tracking-widest text-teal-600 uppercase">
                Journal streak
              </p>
              <p className="text-sm font-light text-slate-700 font-serif italic">
                {monthName}
              </p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 border border-teal-300">
                <span className="text-xs">🔥</span>
                <span className="text-xs font-medium text-teal-800">
                  {streak} {streak === 1 ? "day" : "days"}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {(
              [
                ["‹", -1],
                ["›", 1],
              ] as [string, number][]
            ).map(([label, dir]) => (
              <button
                key={label}
                onClick={() => setViewDate(new Date(year, month + dir, 1))}
                className="w-6 h-6 rounded-full bg-teal-50 border border-teal-300 text-teal-700 hover:bg-teal-100 transition-all text-xs flex items-center justify-center"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Day labels */}
        <div className="px-3 pt-2 grid grid-cols-7 gap-0.5">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div
              key={i}
              className="text-center text-[9px] font-semibold text-teal-600 uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="px-3 pt-1 pb-4 grid grid-cols-7 gap-1">
          {blanks.map((_, i) => (
            <div key={`b${i}`} />
          ))}
          {days.map(({ day, key, hasEntry, isToday, entries: dayEntries }) => (
            <motion.div
              key={day}
              whileHover={{ scale: hasEntry ? 1.1 : 1.05 }}
              onClick={() => handleDateClick(key, dayEntries)}
              className={`relative aspect-square flex items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer ${
                hasEntry
                  ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md hover:shadow-lg"
                  : isToday
                  ? "bg-teal-100 text-teal-800 border-2 border-teal-400 hover:bg-teal-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {day}
              {/* Show count badge if multiple entries */}
              {dayEntries.length > 1 ? (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-[7px] font-bold text-amber-900 flex items-center justify-center">
                  {dayEntries.length}
                </span>
              ) : hasEntry ? (
                <span className="absolute -top-0.5 -right-0.5 text-[7px]">
                  ✨
                </span>
              ) : null}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="px-4 pb-3 flex items-center gap-3 border-t border-teal-200/30 pt-2">
          {[
            ["bg-teal-500", "Has entries"],
            ["border-2 border-teal-400 bg-teal-100", "Today"],
            ["bg-gray-100 border border-gray-300", "No entries"],
          ].map(([cls, label]) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full ${cls}`} />
              <span className="text-[9px] text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-entry picker modal */}
      <AnimatePresence>
        {showModal && selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              className="max-w-sm w-full bg-gradient-to-br from-teal-50 to-amber-50 border border-teal-300 rounded-2xl shadow-xl"
              // No overflow-y-auto here — no scrollbar
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="px-5 py-4 flex items-center justify-between border-b border-teal-200 rounded-t-2xl">
                <div>
                  <h3 className="font-serif text-base text-slate-800">
                    {new Date(selectedDate).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </h3>
                  <p className="text-[10px] text-teal-600 mt-0.5">
                    {writtenDays.get(selectedDate)?.length} entries — tap one to open
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Entry list — no scroll, all shown inline */}
              <div className="p-4 space-y-2">
                {writtenDays.get(selectedDate)?.map((entry) => (
                  <motion.div
                    key={entry._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEntryClick(entry._id)}
                    className="bg-white rounded-xl p-3.5 border border-teal-200 shadow-sm cursor-pointer hover:border-teal-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {entry.mood && (
                          <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full mb-1.5 inline-block">
                            {entry.mood}
                          </span>
                        )}
                        <p className="font-serif italic text-slate-700 text-xs leading-relaxed truncate">
                          "{entry.content}"
                        </p>
                        <p className="font-mono text-[9px] text-teal-500 mt-1.5">
                          {new Date(entry.createdAt).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {/* Arrow hint */}
                      <span className="text-teal-400 text-sm mt-0.5 shrink-0">→</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CalendarStreak;