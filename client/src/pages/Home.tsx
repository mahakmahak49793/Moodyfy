import { useRef} from "react";
import {
  motion,
  
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const themeColor = "rgb(3, 131, 153)";
const themeColorLight = "rgba(3, 131, 153, 0.1)";
const themeColorMedium = "rgba(3, 131, 153, 0.2)";
const themeColorDark = "rgb(2, 90, 105)";
interface ModernHeroProps {
  isLoggedIn: boolean;
  onExploreClick: () => void;
  onStartClick: () => void;
}

const features = [
  {
    emoji: "📓",
    title: "Daily Journal",
    description:
      "Write freely about your thoughts, emotions, and daily experiences. A private, judgment-free space to pour everything out.",
    accent: "from-teal-50 to-teal-100/50",
    border: "border-teal-200/60",
    label: "bg-teal-100 text-teal-700",
    tag: "Journaling",
  },
  {
    emoji: "🌸",
    title: "Gratitude Practice",
    description:
      "Capture positive moments and things you're thankful for. Build a beautiful archive of life's small, beautiful joys.",
    accent: "from-amber-50 to-amber-100/50",
    border: "border-amber-200/60",
    label: "bg-amber-100 text-amber-700",
    tag: "Gratitude",
  },
  {
    emoji: "✨",
    title: "AI Insights",
    description:
      "Select any entry and receive thoughtful AI analysis — emotional patterns, stress triggers, and personalised well-being guidance.",
    accent: "from-indigo-50 to-indigo-100/50",
    border: "border-indigo-200/60",
    label: "bg-indigo-100 text-indigo-700",
    tag: "AI-Powered",
  },
  {
    emoji: "🔥",
    title: "Streak Tracking",
    description:
      "Build and maintain journaling and gratitude streaks. Consistency compounds into profound emotional growth over time.",
    accent: "from-rose-50 to-rose-100/50",
    border: "border-rose-200/60",
    label: "bg-rose-100 text-rose-700",
    tag: "Habits",
  },
  {
    emoji: "📖",
    title: "Random Memories",
    description:
      "Rediscover meaningful moments with a feature that surfaces beautiful past entries — a gentle reminder of how far you've come.",
    accent: "from-teal-50 to-amber-50/60",
    border: "border-teal-200/60",
    label: "bg-teal-100 text-teal-700",
    tag: "Memories",
  },
  {
    emoji: "🌱",
    title: "Emotional Growth",
    description:
      "Track your emotional journey over time. Moodyfy is your companion for self-awareness, mindfulness, and personal growth.",
    accent: "from-amber-50 to-teal-50/60",
    border: "border-amber-200/60",
    label: "bg-amber-100 text-amber-700",
    tag: "Growth",
  },
];

// ─── Steps data — UNTOUCHED ───────────────────────────────────────────────────
const steps = [
  {
    icon: "✎",
    step: "01",
    title: "Write your entry",
    desc: "Open your journal or gratitude diary and write freely. No rules — just your honest thoughts and feelings.",
  },
  {
    icon: "◎",
    step: "02",
    title: "Build your habit",
    desc: "Show up daily to maintain your streak. Even two sentences counts. Consistency is the foundation of self-understanding.",
  },
  {
    icon: "◈",
    step: "03",
    title: "Request AI insights",
    desc: "Select any entry and ask Moodyfy to analyse it. Receive a thoughtful breakdown of emotional patterns and personalised guidance.",
  },
  {
    icon: "✦",
    step: "04",
    title: "Revisit & grow",
    desc: "Use the random memory feature to rediscover past gratitude entries and watch your emotional intelligence deepen over time.",
  },
];

const tickerItems = [
  "Daily Journal",
  "✦",
  "Gratitude Practice",
  "✦",
  "AI Insights",
  "✦",
  "Streak Tracking",
  "✦",
  "Random Memories",
  "✦",
  "Emotional Growth",
  "✦",
  "Self-Reflection",
  "✦",
  "Inner Clarity",
  "✦",
];
const Ticker = ({ reverse = false }: { reverse?: boolean }) => {
  const items = [...tickerItems, ...tickerItems, ...tickerItems];
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: reverse ? ["0%", "33.33%"] : ["0%", "-33.33%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={`text-xs font-semibold tracking-[0.2em] uppercase shrink-0 ${item === "✦" ? "text-teal-400/50" : "text-slate-500/60"}`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const BentoGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-auto">

    {/* What is Moodyfy */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="lg:col-span-2 rounded-2xl bg-white/90 backdrop-blur-sm border border-teal-200 shadow-md p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 via-amber-400 to-teal-400" />
      <div className="absolute -right-8 -bottom-8 text-[120px] opacity-[0.04] select-none pointer-events-none leading-none">
        📓
      </div>
      <p className="text-[10px] font-semibold tracking-widest text-teal-600 uppercase mb-3">
        What is Moodyfy?
      </p>
      <h3
        className="font-serif italic font-light text-slate-800 text-xl sm:text-2xl leading-snug mb-3"
        style={{ maxWidth: "480px" }}
      >
        An AI-powered journaling companion that helps you understand yourself
      </h3>
      <p
        className="font-serif italic font-light text-gray-500 text-sm leading-relaxed"
        style={{ maxWidth: "460px" }}
      >
        Write daily journal entries and gratitude notes. Let AI surface the
        emotional patterns, stress sources, and hidden insights buried inside
        your own words — then act on them.
      </p>
    </motion.div>

    {/* Streak */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl shadow-md p-6 text-white relative overflow-hidden"
      style={{ background: themeColor }}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <p className="text-[10px] font-semibold tracking-widest uppercase text-white/80 mb-4">
        Streak Tracking
      </p>
      <div className="text-5xl font-serif font-light mb-1">🔥</div>
      <p className="font-serif italic text-white/80 text-sm mt-3 leading-relaxed">
        Every day you write, your streak grows. Every streak builds the habit of
        knowing yourself.
      </p>
    </motion.div>

    {/* AI Insight */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/40 border border-indigo-200/60 shadow-md p-5 relative overflow-hidden"
    >
      <div className="absolute -right-4 -bottom-4 text-[70px] opacity-[0.07] select-none pointer-events-none">
        ✨
      </div>
      <p className="text-[10px] font-semibold tracking-widest text-indigo-700 uppercase mb-3">
        AI Insights
      </p>
      <p className="font-serif italic text-gray-700 text-sm leading-relaxed">
        Receive thoughtful analysis of your emotional patterns, stress triggers,
        and personalised well-being guidance — all from your own words.
      </p>
    </motion.div>

    {/* Random Memories */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60 shadow-md p-5 relative overflow-hidden"
    >
      <div className="absolute -right-4 -bottom-4 text-[70px] opacity-[0.08] select-none pointer-events-none">
        📖
      </div>
      <p className="text-[10px] font-semibold tracking-widest text-amber-700 uppercase mb-3">
        Random Memories
      </p>
      <p className="font-serif italic text-gray-700 text-sm leading-relaxed">
        Rediscover meaningful past entries surfaced at random — a gentle reminder
        of how far you've come.
      </p>
    </motion.div>

    {/* Philosophy */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl shadow-md p-6 relative overflow-hidden text-white"
      style={{ background: themeColorDark }}
    >
      <div className="absolute top-3 left-4 text-5xl text-white/5 font-serif select-none">
        "
      </div>
      <p className="font-serif italic font-light text-white/80 text-sm leading-relaxed mt-2">
        Gratitude grounds you today, reflection guides you tomorrow.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <div className="w-5 h-px bg-white/30" />
        <span className="text-[10px] text-white/50 font-serif italic tracking-wider">
          the moodyfy philosophy
        </span>
      </div>
    </motion.div>

  </div>
);

const ModernHero = ({onExploreClick, onStartClick }: ModernHeroProps) => {
  return (
    <section
      className="relative  overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8f6f1 0%, #fff 50%, #f0faf8 100%)",
      }}
    >
      {/* Decorative elements with theme color */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: themeColor }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: themeColor }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-12 lg:py-16">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-6 sm:mb-8 shadow-sm"
              style={{ borderColor: themeColorMedium }}
            >
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: themeColor }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2"
                  style={{ background: themeColor }}
                />
              </span>
              <span
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] uppercase"
                style={{ color: themeColor }}
              >
                AI-Powered Journaling
              </span>
            </motion.div>

            {/* Main headline */}
            <h1
              className="font-serif italic font-light text-slate-800 leading-[1.1] mb-4 sm:mb-6"
              style={{ fontSize: "clamp(1.8rem, 5vw, 4rem)" }}
            >
              Write your way to{" "}
              <span className="relative inline-block">
                <span className="relative z-10" style={{ color: themeColor }}>
                  clarity
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute bottom-1 sm:bottom-2 left-0 h-2 sm:h-3 -z-0"
                  style={{ background: themeColorMedium }}
                />
              </span>
            </h1>

            <p className="font-serif italic font-light text-slate-500 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md">
              Moodyfy helps you understand yourself through daily journaling,
              gratitude practice, and AI insights that reveal patterns you never
              noticed.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreClick}
                className="border px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all"
                style={{ borderColor: themeColorMedium, color: themeColor }}
              >
                Explore features ↓
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartClick}
                className="text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all shadow-lg"
                style={{ background: themeColor }}
              >
                Start journaling free
              </motion.button>
            </div>
          </motion.div>

          {/* Right content - Smaller Spiral Notebook */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative scale-90 sm:scale-100"
            >
              {/* Notebook body - smaller size */}
              <div
                className="w-[280px] sm:w-[300px] md:w-[340px] h-[360px] sm:h-[380px] md:h-[400px] rounded-lg shadow-2xl overflow-hidden"
                style={{
                  background: "#fffef8",
                  border: `1px solid ${themeColorMedium}`,
                }}
              >
                {/* Spiral binding dots */}
                <div className="absolute -left-3 top-6 bottom-6 w-5 flex flex-col justify-around">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: themeColor }}
                    />
                  ))}
                </div>

                {/* Cover fold line */}
                <div
                  className="absolute left-5 top-0 bottom-0 w-px"
                  style={{ background: themeColorLight }}
                />

                {/* Content area */}
                <div className="p-4 pl-8 sm:p-5 sm:pl-9">
                  {/* Date */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div
                      className="w-16 sm:w-20 h-1.5 rounded"
                      style={{ background: themeColor }}
                    />
                    <div
                      className="text-[8px] sm:text-[9px] font-serif italic"
                      style={{ color: themeColor }}
                    >
                      ✨ today's entry
                    </div>
                  </div>

                  {/* Journal lines with content */}
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="font-serif italic text-[10px] sm:text-xs text-gray-600 leading-relaxed"
                    >
                      Today I felt truly present.
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="font-serif italic text-[10px] sm:text-xs text-gray-600 leading-relaxed"
                    >
                      Grateful for the morning light,
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      className="font-serif italic text-[10px] sm:text-xs text-gray-600 leading-relaxed"
                    >
                      the quiet before the world woke up,
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.4 }}
                      className="font-serif italic text-[10px] sm:text-xs text-gray-600 leading-relaxed"
                    >
                      and the warmth of my coffee.
                    </motion.div>

                    <div
                      className="h-px my-2 sm:my-3"
                      style={{ background: themeColorMedium }}
                    />

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0, duration: 0.4 }}
                      className="font-serif italic text-[10px] sm:text-xs text-gray-500 leading-relaxed"
                    >
                      🌸 Three things I'm grateful for:
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2, duration: 0.4 }}
                      className="font-serif italic text-[10px] sm:text-xs text-gray-600 leading-relaxed pl-2 sm:pl-3"
                    >
                      • A kind message from a friend
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4, duration: 0.4 }}
                      className="font-serif italic text-[10px] sm:text-xs text-gray-600 leading-relaxed pl-2 sm:pl-3"
                    >
                      • The sunset painted the sky gold
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6, duration: 0.4 }}
                      className="font-serif italic text-[10px] sm:text-xs text-gray-600 leading-relaxed pl-2 sm:pl-3"
                    >
                      • This quiet moment with myself
                    </motion.div>
                  </div>
                </div>

                {/* Bookmark ribbon */}
                <motion.div
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -right-6 sm:-right-8 top-3 sm:top-4 w-6 sm:w-8 h-10 sm:h-12 rounded-r-sm"
                  style={{ background: themeColor }}
                />
              </div>

              {/* Floating pen - smaller */}
              <motion.div
                animate={{
                  rotate: [8, 15, 8],
                  x: [0, 6, 0],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -right-5 sm:-bottom-5 sm:-right-6 z-10"
              >
                <div className="flex items-center">
                  <div
                    className="w-16 sm:w-20 h-1 rounded-full"
                    style={{ background: themeColorDark }}
                  />
                  <div
                    className="w-0 h-0"
                    style={{
                      borderTop: "5px solid transparent",
                      borderBottom: "5px solid transparent",
                      borderLeft: `8px solid ${themeColor}`,
                    }}
                  />
                </div>
              </motion.div>

              {/* AI insight badge - smaller */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.0, duration: 0.5 }}
                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg"
                style={{
                  background: "white",
                  border: `1px solid ${themeColor}`,
                }}
              >
                <div className="flex items-center gap-1">
                  <span className="text-[10px] sm:text-xs">✨</span>
                  <span
                    className="text-[7px] sm:text-[9px] font-semibold"
                    style={{ color: themeColor }}
                  >
                    AI Insight
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const Home = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(
    (state: { auth: { token: any; user: any } }) =>
      !!state.auth.token && !!state.auth.user,
  );
  const handleJournalingClick = () => {
    if (isLoggedIn) {
      navigate("/journal");
    } else {
      navigate("/signup");
    }
  };

  const handleExploreClick = () => {
    featuresRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="w-full min-h-screen font-serif bg-[#f8f6f1]">
      {/* HERO SECTION */}
      <ModernHero
        isLoggedIn={isLoggedIn}
        onExploreClick={handleExploreClick}
        onStartClick={handleJournalingClick}
      />

      <div className="py-4 border-y border-teal-200/40 bg-white/60 backdrop-blur-sm space-y-2">
        <Ticker />
        <Ticker reverse />
      </div>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-teal-600 uppercase flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-teal-400 inline-block" /> Built for
              self-awareness
            </p>
            <h2
              className="font-serif italic font-light text-slate-800 leading-tight"
              style={{ fontSize: "clamp(1.6rem,3.5vw,2.8rem)" }}
            >
              A space to know yourself
            </h2>
          </div>
          <p
            className="font-serif italic font-light text-slate-500 text-sm leading-relaxed"
            style={{ maxWidth: "300px" }}
          >
            Everything inside Moodyfy is designed to gently hold your inner
            world.
          </p>
        </div>
        <BentoGrid />
      </section>

      {/* ── Features — UNTOUCHED ──────────────────────────────────────────── */}
      <section
        ref={featuresRef}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-teal-600 uppercase flex items-center justify-center gap-2 mb-3">
            <span className="inline-block w-4 h-px bg-teal-400" /> Everything
            you need
          </p>
          <h2
            className="font-serif italic font-light text-slate-800 leading-tight"
            style={{ fontSize: "clamp(1.6rem,4vw,2.6rem)" }}
          >
            Your complete toolkit for{" "}
            <span className="text-teal-600">inner clarity</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
              className={`rounded-2xl bg-gradient-to-br ${f.accent} border ${f.border} p-5 shadow-md transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${f.label}`}
                >
                  {f.tag}
                </span>
                <span className="text-2xl">{f.emoji}</span>
              </div>
              <h3 className="font-serif font-medium text-slate-800 text-base mb-2 leading-snug">
                {f.title}
              </h3>
              <div className="h-px bg-gradient-to-r from-transparent via-teal-200/60 to-transparent my-3" />
              <p className="font-serif italic font-light text-gray-600 text-sm leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works — UNTOUCHED ──────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-teal-600 uppercase flex items-center justify-center gap-2 mb-3">
            <span className="inline-block w-4 h-px bg-teal-400" /> The process
          </p>
          <h2
            className="font-serif italic font-light text-slate-800"
            style={{ fontSize: "clamp(1.6rem,4vw,2.6rem)" }}
          >
            How Moodyfy works
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-200 via-teal-300/60 to-transparent -translate-x-1/2" />
          <div className="space-y-10">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative flex items-start gap-6 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
              >
                <div
                  className="absolute left-5 sm:left-1/2 w-3 h-3 rounded-full border-2 border-white shadow-md -translate-x-1/2 mt-3 z-10"
                  style={{ background: themeColor }}
                />
                <div
                  className={`ml-14 sm:ml-0 sm:w-[44%] ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12 sm:text-left"}`}
                >
                  <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-teal-200 p-5 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-300/0 via-teal-400/60 to-teal-300/0" />
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-sm shrink-0"
                        style={{ color: themeColor }}
                      >
                        {s.icon}
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-teal-400 block">
                          STEP {s.step}
                        </span>
                        <span className="font-serif font-medium text-slate-800 text-base">
                          {s.title}
                        </span>
                      </div>
                    </div>
                    <p className="font-serif italic font-light text-gray-500 text-sm leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block sm:w-[44%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy — full-bleed editorial strip ─────────────────────────── */}
      <section
        className="py-24 px-6 sm:px-12 relative overflow-hidden"
        style={{ background: themeColorLight }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px"
              style={{ top: `${80 + i * 52}px`, background: themeColorMedium }}
            />
          ))}
        </div>
        <div
          className="absolute left-4 sm:left-10 top-6 font-serif font-bold select-none leading-none opacity-20"
          style={{ fontSize: "clamp(100px,14vw,180px)", color: themeColor }}
        >
          "
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1"
            >
              <p
                className="text-[10px] font-semibold tracking-[0.2em] uppercase flex items-center gap-2 mb-6"
                style={{ color: themeColor }}
              >
                <span
                  className="w-4 h-px inline-block"
                  style={{ background: themeColor }}
                />{" "}
                The philosophy
              </p>
              <blockquote
                className="font-serif italic font-light text-slate-700 leading-relaxed"
                style={{ fontSize: "clamp(1.3rem,3vw,2rem)" }}
              >
                Gratitude doesn't erase hard days — it helps you notice that
                good ones exist too.
              </blockquote>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:w-64 shrink-0"
            >
              <p
                className="font-serif italic font-light text-slate-400 text-sm leading-relaxed pl-4"
                style={{ borderLeft: `2px solid ${themeColorMedium}` }}
              >
                Moodyfy was built on the belief that self-reflection — done
                gently and consistently — is the most powerful thing a person
                can do for their inner life.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-teal-200/50"
          >
            {[
              {
                emoji: "🪞",
                heading: "Honest reflection",
                body: "Write without a filter. The page holds everything.",
              },
              {
                emoji: "🌱",
                heading: "Gentle consistency",
                body: "Small entries every day build extraordinary self-awareness over time.",
              },
              {
                emoji: "✦",
                heading: "AI as a mirror",
                body: "Not a therapist — a thoughtful lens that shows you what you can't see alone.",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="py-6 sm:py-0 sm:px-8 first:pl-0 last:pr-0"
              >
                <div className="text-2xl mb-3">{p.emoji}</div>
                <h4 className="font-serif font-medium text-slate-700 text-base mb-2">
                  {p.heading}
                </h4>
                <p className="font-serif italic font-light text-slate-400 text-sm leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA — Using theme color ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: themeColor }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-20 bg-[#f0faf8]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)" }}
        />

        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 font-serif italic font-bold text-white/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(100px,16vw,220px)" }}
        >
          write.
        </div>

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle,white 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 pt-28 pb-24 px-6 sm:px-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="text-4xl mb-6"
              >
                🌿
              </motion.div>
              <h2
                className="font-serif italic font-light text-white leading-tight mb-5"
                style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)" }}
              >
                Your most honest
                <br />
                <span className="text-teal-200">conversation</span> starts here.
              </h2>
              <p
                className="font-serif italic font-light text-white/70 text-base leading-relaxed"
                style={{ maxWidth: "380px" }}
              >
                Free to start. No credit card. Just you, your thoughts, and the
                clarity that consistent reflection brings.
              </p>
              <p className="mt-6 text-xs text-white/40 font-serif italic">
                ✦ Your thoughts are private and encrypted ✦
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col gap-5"
            >
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleJournalingClick}
                className="group flex items-center justify-between bg-white text-teal-700 font-medium px-8 py-5 rounded-2xl text-base tracking-wide hover:bg-teal-50 transition-all shadow-xl text-left"
              >
                <div>
                  <p className="font-serif font-medium text-teal-800 text-lg leading-snug">
                    Start journaling free
                  </p>
                  <p className="font-serif italic font-light text-teal-500 text-sm mt-0.5">
                    Write your first entry today
                  </p>
                </div>
                <span className="text-teal-400 text-xl group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-10"
          style={{
            background: themeColorDark,
            clipPath: "polygon(0 100%,100% 0,100% 100%)",
          }}
        />
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: themeColorDark }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
            style={{
              background: `${themeColorLight}`,
              border: `1px solid ${themeColorMedium}`,
            }}
          >
            ✦
          </div>
          <span className="font-serif italic text-white text-base">
            Moodyfy
          </span>
        </div>
        <p className="text-xs text-white font-serif italic">
          © 2026 Moodyfy · Made with care for your inner world
        </p>
      </footer>
    </div>
  );
};

export default Home;
