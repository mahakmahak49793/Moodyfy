import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { analyzeJournal, clearCurrentInsight } from "../features/insights/insightsSlice";
import { getJournals } from "../features/journal/journalSlice";
import type { Journal } from "../features/journal/journalTypes";
import type { AIInsight } from "../features/insights/insightsTypes";

import JournalPicker from "../components/insights/JournalPicker";
import MobileJournalSheet from "../components/insights/MobileJournalSheet";
import InsightPanel from "../components/insights/InsightPanel";
import { GlassCard, Section, BreathingLoader } from "../components/insights/InsightPrimitives";
import { getEmotionPill } from "../components/insights/insightConstants";
import { MOOD_COLORS } from "../components/insights/insightConstants";
import { HistoryCard, MoodConstellation, ViewMoreButton } from "../components/insights/InsightSidebar";

// ─── Hero ─────────────────────────────────────────────────────────────────────
const HeroSection = ({ insights }: { insights: AIInsight[] }) => {
  const latest = insights[0];
  const pill = latest ? getEmotionPill(latest.emotion) : null;
  return (
    <div className="px-4 sm:px-6 md:px-8 pt-8 pb-6">
      <p className="text-xs font-semibold tracking-widest text-slate-800 uppercase mb-2 flex items-center gap-2">
        <span className="inline-block w-4 h-px bg-teal-500/70" />
        Emotional overview
      </p>
      <h2
        className="font-serif italic font-light text-slate-900 drop-shadow-sm mb-2"
        style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", lineHeight: 1.2 }}
      >
        {latest ? `You've been feeling ${latest.emotion}` : "Your inner landscape"}
      </h2>
      <p className="text-sm font-light text-slate-800 max-w-lg leading-relaxed">
        {latest
          ? "Here's a gentle reflection on your recent emotional journey."
          : "Select a journal entry on the left to begin your reflection."}
      </p>
      {latest && pill && (
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full border backdrop-blur-sm ${pill}`}>
            {latest.emotion}
          </span>
          <span className="text-xs font-mono font-semibold text-slate-700">
            Last analyzed{" "}
            {new Date(latest.createdAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>
      )}
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />
    </div>
  );
};

// ─── Desktop journal preview panel (slides in from right inside main area) ────
const DesktopJournalPreview = ({
  journal,
  onAnalyze,
  onDismiss,
  loading,
}: {
  journal: Journal;
  onAnalyze: () => void;
  onDismiss: () => void;
  loading: boolean;
}) => {
  const mood = MOOD_COLORS[journal.mood] ?? MOOD_COLORS.neutral;
  return (
    <div className="animate-[fadeSlideIn_0.3s_ease_both] flex flex-col">
      <GlassCard className="flex flex-col gap-5">
        {/* Header row with analyze button next to close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-medium px-3 py-1 rounded-full border backdrop-blur-sm ${mood.bg} ${mood.text} ${mood.border}`}>
                {journal.mood}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-600">
                {new Date(journal.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </span>
            </div>
            <h3 className="font-serif italic font-light text-slate-900 text-2xl leading-snug">
              {journal.title || "Untitled"}
            </h3>
          </div>
          {/* Button group - Analyze and Dismiss side by side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onAnalyze}
              disabled={loading}
              className="px-4 py-2 rounded-full border border-teal-400/60 bg-teal-500/15 text-sm font-medium text-teal-900
                hover:bg-teal-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed
                flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 rounded-full border border-teal-700/50 border-t-teal-700 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "✦ Analyze"
              )}
            </button>
            <button
              onClick={onDismiss}
              className="w-8 h-8 rounded-full bg-white/40 border border-white/50 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white/60 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent" />

        {/* Content - auto height based on content, no fixed max-height */}
        <div className="pr-1">
          <p className="text-sm font-light leading-relaxed text-slate-700 whitespace-pre-wrap break-words">
            {journal.content}
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const InsightPage = () => {
  const dispatch = useAppDispatch();
  const { journals } = useAppSelector((state: any) => state.journal);
  const { insights, currentInsight, loading, error } = useAppSelector(
    (state: any) => state.insight
  );

  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [activeInsight, setActiveInsight] = useState<AIInsight | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sheetJournal, setSheetJournal] = useState<Journal | null>(null);
  const [previewJournal, setPreviewJournal] = useState<Journal | null>(null);
  const [showAllReflections, setShowAllReflections] = useState(false);

  useEffect(() => {
    dispatch(getJournals());
    return () => { dispatch(clearCurrentInsight()); };
  }, [dispatch]);

  useEffect(() => {
    if (currentInsight) {
      setActiveInsight(currentInsight);
      setIsSidebarOpen(false);
      setPreviewJournal(null);
    }
  }, [currentInsight]);

  const handleAnalyze = () => {
    if (!selectedJournal) return;
    dispatch(analyzeJournal(selectedJournal._id));
  };

  const handleJournalSelect = (journal: Journal) => {
    setSelectedJournal(journal);
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setSheetJournal(journal);
      setIsSidebarOpen(false);
    } else {
      setPreviewJournal(journal);
    }
  };

  // Display insights - show only 3 if not expanded
  const displayedInsights = showAllReflections ? insights : insights.slice(0, 3);

  const showInsight   = !loading && !error && activeInsight && !previewJournal;
  const showPreview   = !loading && !error && previewJournal;
  const showEmpty     = !loading && !error && !activeInsight && !previewJournal;

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(2,28,38,0.55) 0%,
              rgba(3,60,80,0.35) 30%,
              rgba(240,249,255,0.82) 65%,
              rgba(240,253,250,0.92) 100%
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

          {/* ── Sidebar ── */}
          <aside
            className={`
              fixed lg:relative z-40
              w-72 sm:w-80 h-full
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              flex flex-col bg-white/15 backdrop-blur-md border-r border-white/25 shadow-xl lg:shadow-none
            `}
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 z-50 text-white/80 hover:text-white bg-white/15 rounded-full p-1.5 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <JournalPicker
              journals={journals}
              selectedId={selectedJournal?._id ?? null}
              onSelect={handleJournalSelect}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
          </aside>

          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* ── Main panel ── */}
          <div className="flex-1 flex flex-col bg-transparent min-h-screen overflow-y-auto">

            {/* Mobile top bar */}
            <div className="lg:hidden px-4 pt-5 pb-2 flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-full border border-white/50 bg-white/35 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-800 hover:border-[rgb(3_131_153)] hover:text-[rgb(3_131_153)] transition-all shadow-sm"
              >
                ☰ Journals
              </button>
              {selectedJournal && (
                <span className="text-xs font-light text-slate-700 truncate flex-1">
                  <span className="text-teal-700 font-medium">Selected: </span>
                  {selectedJournal.title || "Untitled"}
                </span>
              )}
            </div>

            <HeroSection insights={insights} />

            <div className="px-4 sm:px-6 md:px-8 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Main col (2/3) ── */}
              <div className="lg:col-span-2">
                {loading && <BreathingLoader />}

                {error && !loading && (
                  <GlassCard className="border-rose-200/40 bg-rose-50/20 text-center py-10">
                    <p className="text-sm font-light text-rose-800 font-serif italic">
                      Something went quiet. {error}
                    </p>
                  </GlassCard>
                )}

                {/* Insight result — shown when no preview is open */}
                {showInsight && <InsightPanel insight={activeInsight!} />}

                {/* Desktop inline journal preview */}
                {showPreview && (
                  <DesktopJournalPreview
                    journal={previewJournal!}
                    onAnalyze={handleAnalyze}
                    onDismiss={() => {
                      setPreviewJournal(null);
                      setSelectedJournal(null);
                    }}
                    loading={loading}
                  />
                )}

                {showEmpty && (
                  <GlassCard className="text-center py-16">
                    <div className="w-12 h-12 mx-auto mb-5 rounded-full border border-teal-400/40 flex items-center justify-center">
                      <span className="text-teal-600 text-xl">✦</span>
                    </div>
                    <p className="font-serif italic font-light text-slate-700 text-base">
                      Select a journal to begin your reflection.
                    </p>
                    <p className="text-sm text-slate-600 font-light mt-1">
                      Your emotional insights will appear here.
                    </p>
                  </GlassCard>
                )}
              </div>

              {/* ── Right col (1/3) ── */}
              <div className="space-y-6">
                {journals.length > 0 && <MoodConstellation journals={journals} />}

                {insights.length > 0 && (
                  <Section title="Past reflections">
                    <div className="space-y-2">
                      {displayedInsights.map((ins: AIInsight) => (
                        <HistoryCard
                          key={ins._id}
                          insight={ins}
                          active={activeInsight?._id === ins._id}
                          onSelect={() => {
                            setActiveInsight(ins);
                            setPreviewJournal(null);
                          }}
                        />
                      ))}
                    </div>
                    <ViewMoreButton 
                      onClick={() => setShowAllReflections(!showAllReflections)}
                      count={insights.length}
                      showAll={showAllReflections}
                    />
                  </Section>
                )}

                {insights.length === 0 && !loading && (
                  <GlassCard className="text-center py-8">
                    <p className="font-serif italic font-light text-slate-600 text-sm leading-relaxed">
                      Your reflections will appear here as you analyze more entries.
                    </p>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <MobileJournalSheet
        journal={sheetJournal}
        onClose={() => setSheetJournal(null)}
        onAnalyze={handleAnalyze}
        loading={loading}
      />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default InsightPage;