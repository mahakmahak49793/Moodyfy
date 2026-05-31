import { motion } from "framer-motion";

interface Props {
  totalEntries: number;
  streak: number;
  todayCount: number;
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return { text: "Still awake?",       emoji: "🌙" };
  if (h < 12) return { text: "Good morning",        emoji: "🌅" };
  if (h < 17) return { text: "Good afternoon",      emoji: "☀️" };
  if (h < 21) return { text: "Good evening",        emoji: "" };
  return       { text: "Good night",                emoji: "🌙" };
};

const QUOTES = [
  { text: "The quieter you become, the more you are able to hear.", author: "Rumi" },
  { text: "Your feelings are valid messengers, not permanent residents.", author: "Moodyfy" },
  { text: "Writing is the painting of the voice.", author: "Voltaire" },
  { text: "Breathing in, I calm my body. Breathing out, I smile.", author: "Thich Nhat Hanh" },
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "Not all storms come to disrupt your life, some come to clear your path.", author: "Unknown" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
];

const DashboardHero = ({ totalEntries, streak, todayCount }: Props) => {
  const greeting = getGreeting();
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  return (
    <motion.section
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left: text */}
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-widest text-teal-200/90 uppercase mb-2 flex items-center gap-2">
            <span className="inline-block w-4 h-px bg-teal-400/60" />
            {greeting.emoji} {greeting.text}
          </p>

          <h1
            className="font-serif italic font-light text-white leading-tight mb-3 drop-shadow-sm"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
          >
            How is your heart feeling today?
          </h1>

          {/* Rotating quote */}
          <p className="text-sm font-light text-white/55 mb-5 font-serif italic max-w-lg leading-relaxed">
            "{quote.text}"
            <span className="text-[10px] not-italic font-mono text-teal-300/40 ml-2">
              — {quote.author}
            </span>
          </p>

          {/* Stats pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {streak > 0 && (
              <span className="text-xs font-medium text-teal-200/90 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full">
                🔥 {streak} day streak
              </span>
            )}
            {todayCount > 0 && (
              <span className="text-xs font-medium text-white/70 bg-white/15 border border-white/20 px-3 py-1 rounded-full">
                ✍️ {todayCount} {todayCount === 1 ? "entry" : "entries"} today
              </span>
            )}
            {totalEntries > 0 && (
              <span className="text-xs font-medium text-white/45 bg-white/8 border border-white/12 px-3 py-1 rounded-full">
                📖 {totalEntries} total
              </span>
            )}
            {streak === 0 && todayCount === 0 && (
              <span className="text-xs font-light text-white/40 font-serif italic">
                Start today and build your streak 🌿
              </span>
            )}
          </div>
        </div>

    
      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.section>
  );
};

export default DashboardHero;