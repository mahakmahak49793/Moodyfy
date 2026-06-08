import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getJournals, createJournal } from "../features/journal/journalSlice";
import { getGratitudes } from "../features/gratitude/gratitudeSlice";

import DashboardHero from "../components/dashboard/DashboardHero";
import CalendarStreak from "../components/dashboard/CalendarStreak";
import QuickJournal from "../components/dashboard/QuickJournal";
import RecentReflections from "../components/dashboard/RecentReflections";
import GratitudeDiaryCard from "../components/dashboard/GratitudeDiaryCard";
import MilestoneStrip from "../components/dashboard/Milestonestrip";
import EmotionalWeather from "../components/dashboard/Emotionalweather";
import DailyInsight from "../components/dashboard/DailyInsight";
import DashboardDiaryCover from "../components/dashboard/DashboarddiaryCover";

const toDateKey = (d: string) => new Date(d).toLocaleDateString("en-CA");

const calcStreak = (entries: { createdAt: string }[]) => {
  if (!entries.length) return 0;
  const days = [...new Set(entries.map((e) => toDateKey(e.createdAt)))].sort(
    (a, b) => (a > b ? -1 : 1),
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

// ─── staggered section wrapper ───────────────────────────────────────────────
const Section = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [diaryOpen, setDiaryOpen] = useState(false);

  // ── selectors — adjust slice names to match yours ──────────────────────────
  const { journals = [], loading: journalLoading } = useAppSelector(
    (state: any) => state.journal,
  );
  const { gratitudes = [] } = useAppSelector((state: any) => state.gratitude);

  useEffect(() => {
    dispatch(getJournals());
    dispatch(getGratitudes());
  }, [dispatch]);

  // ── derived stats ──────────────────────────────────────────────────────────
  const todayKey = new Date().toLocaleDateString("en-CA");
  const streak = useMemo(() => calcStreak(journals), [journals]);
  const gratitudeStreak = useMemo(() => calcStreak(gratitudes), [gratitudes]);
  const todayCount = useMemo(
    () =>
      journals.filter((j: any) => toDateKey(j.createdAt) === todayKey).length,
    [journals, todayKey],
  );

 const handleSaveJournal = async (text: string, mood?: string) => {
  if (!text.trim()) return;
  
  try {
    const result = await dispatch(createJournal({ 
      title: text.slice(0, 100), // First 100 chars as title
      content: text,
      mood: mood || "", // Pass the mood string (e.g., "🌿 Peaceful")
    })).unwrap();
    
    console.log("Journal saved successfully:", result);
  } catch (error) {
    console.error("Failed to save journal:", error);
  }
};

  return (
    <>
      {/* ── Full-screen diary cover ── */}
      <AnimatePresence>
        {!diaryOpen && (
          <DashboardDiaryCover onOpen={() => setDiaryOpen(true)} />
        )}
      </AnimatePresence>

      {/* ── Page content ── */}
      <motion.div
        className="min-h-screen font-serif"
        initial={{ opacity: 0 }}
        animate={{ opacity: diaryOpen ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(2, 28, 38, 0.72) 0%,
              rgba(3, 60, 80, 0.50) 28%,
              rgba(240, 249, 255, 0.90) 58%,
              rgba(240, 253, 250, 0.97) 100%
            ),
            url('https://img.freepik.com/premium-photo/calm-ocean-moody-sky_1179475-44119.jpg?semt=ais_hybrid&w=740&q=80')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ── Hero ── */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
  <div className="lg:col-span-8">
    <DashboardHero
      totalEntries={journals.length}
      streak={streak}
      todayCount={todayCount}
    />
  </div>
  <div className="lg:col-span-4">
    <Section delay={0.12}>
      <DailyInsight />
    </Section>
  </div>
</div>


          {/* ── Main two-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* ── Left column ── */}
            <div className="lg:col-span-8 space-y-5">
              {/* Daily intention */}
              {/* <Section delay={0.22}>
                <DailyIntention />
              </Section> */}

              {/* Quick journal */}
              <Section delay={0.28}>
                <QuickJournal
                  onSave={handleSaveJournal}
                  loading={journalLoading}
                  onNavigateToFull={() => {
                    navigate("/journal");
                  }}
                />
              </Section>

              {/* Emotional weather — shows only when there's mood data */}
              {journals.some((j: any) => j.mood) && (
                <Section delay={0.33}>
                  <EmotionalWeather entries={journals} />
                </Section>
              )}

              {/* Calendar — mobile only */}
              <Section delay={0.36} className="lg:hidden">
                <CalendarStreak
                  entries={journals}
                  onNavigateToEntry={(id) =>
                    navigate("/journal", { state: { entryId: id } })
                  }
                />
              </Section>

              {/* Gratitude diary card — mobile only */}
              <Section delay={0.4} className="lg:hidden">
                <GratitudeDiaryCard
                  entries={gratitudes}
                  streak={gratitudeStreak}
                />
              </Section>

              {/* Recent reflections */}
              <Section delay={0.44}>
                <RecentReflections
                  entries={journals}
                  onViewAll={() => navigate("/journal")}
                />
              </Section>

              {/* Empty state */}
              {journals.length === 0 && !journalLoading && (
                <Section delay={0.44}>
                  <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-teal-200 p-10 text-center shadow-lg">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-5xl mb-4"
                    >
                      🌸
                    </motion.div>
                    <p className="font-serif italic font-light text-gray-700 text-lg mb-2">
                      Your journal is waiting.
                    </p>
                    <p className="text-sm font-light text-gray-500 max-w-xs mx-auto leading-relaxed mb-6">
                      Start with how you feel right now — even one sentence is
                      enough to begin.
                    </p>
                    <button
                      onClick={() =>
                        document.querySelector("textarea")?.focus()
                      }
                      className="rounded-full bg-teal-500/15 border border-teal-400/40 px-6 py-2 text-sm font-medium text-teal-700 hover:bg-teal-500/25 transition-all"
                    >
                      🌿 Write your first entry
                    </button>
                  </div>
                </Section>
              )}
            </div>

            {/* ── Right column — desktop only ── */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-5">
              {/* Calendar streak */}
              <Section delay={0.22}>
                <CalendarStreak entries={journals} />
              </Section>

              {/* Gratitude diary card */}
              <Section delay={0.33}>
                <GratitudeDiaryCard
                  entries={gratitudes}
                  streak={gratitudeStreak}
                />
              </Section>

              {/* Emotional weather — desktop (shows even if no mood data yet as a teaser) */}
              {!journals.some((j: any) => j.mood) && (
                <Section delay={0.4}>
                  <div className="rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-md p-5 text-center">
                    <p className="text-xl mb-2">🌤️</p>
                    <p className="font-serif italic text-xs text-gray-500 leading-relaxed">
                      Log moods on your entries to see your emotional weather
                      pattern appear here.
                    </p>
                  </div>
                </Section>
              )}

              {/* Quote card */}
              <Section delay={0.48}>
                <div className="rounded-2xl bg-white/90 border border-teal-200 p-5 text-center shadow-md backdrop-blur-sm">
                  {/* Replaced emoji with a subtle, elegant icon */}
                  <div className="mb-3 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-500 shadow-inner">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </div>
                  </div>

                  <p className="font-serif italic font-light text-gray-600 text-sm leading-relaxed">
                    "Every day may not be good, but there is something good in every day"
                  </p>

                  <p className="text-[9px] text-gray-400 mt-3 tracking-widest uppercase font-mono">
                    — Moodyfy
                  </p>
                </div>
              </Section>
            </div>
          </div>

          {/* ── Milestones — full width, below grid ── */}
          <Section delay={0.5} className="mt-5">
            <MilestoneStrip
              totalEntries={journals.length}
              streak={streak}
              gratitudeCount={gratitudes.length}
            />
          </Section>
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;
