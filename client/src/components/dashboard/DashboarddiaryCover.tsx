import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  onOpen: () => void;
}

const DashboardDiaryCover = ({ onOpen }: Props) => {
  const [phase, setPhase] = useState<"idle" | "opening">("idle");

  const open = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(onOpen, 900);
  };

  useEffect(() => {
    const t = setTimeout(open, 3200);
    return () => clearTimeout(t);
  }, []);

  const hour = new Date().getHours();
  const timeLabel =
    hour < 12 ? "morning pages" : hour < 17 ? "afternoon notes" : hour < 21 ? "evening reflections" : "night thoughts";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{
        backgroundImage: `
          linear-gradient(to bottom,
            rgba(2,28,38,0.78) 0%,
            rgba(3,60,80,0.65) 35%,
            rgba(3,80,100,0.60) 65%,
            rgba(2,50,65,0.80) 100%
          ),
          url('https://img.freepik.com/premium-photo/calm-ocean-moody-sky_1179475-44119.jpg?semt=ais_hybrid&w=740&q=80')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
      onClick={open}
      animate={{ y: phase === "opening" ? "-100%" : "0%" }}
      transition={{ duration: 0.88, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-teal-400/10"
          style={{
            width: 4 + i * 3,
            height: 4 + i * 3,
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* The diary book */}
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
        style={{ width: 240, height: 310 }}
      >
        {/* Shadow */}
        <div
          className="absolute -bottom-5 left-5 right-5 h-10 rounded-full"
          style={{ background: "rgba(0,0,0,0.4)", filter: "blur(16px)" }}
        />
        {/* Book body */}
        <div
          className="absolute inset-0 rounded-r-2xl rounded-l-sm"
          style={{ background: "linear-gradient(160deg, #0e4155 0%, #082d3e 100%)" }}
        />
        {/* Spine */}
        <div
          className="absolute top-0 bottom-0 left-0 w-6 rounded-l-sm"
          style={{ background: "linear-gradient(to right, #041e28, #0a3345)" }}
        />
        {/* Page edges */}
        <div
          className="absolute top-1 bottom-1 right-0 w-2.5 rounded-r-2xl"
          style={{ background: "linear-gradient(to left, #e8f4f0, #d0ebe5)" }}
        />
        {/* Cover face */}
        <div
          className="absolute top-0 bottom-0 left-6 right-2.5 rounded-r-2xl flex flex-col items-center justify-center gap-4 px-6"
          style={{
            background: "linear-gradient(155deg, rgba(3,90,115,0.95) 0%, rgba(2,60,80,0.98) 100%)",
          }}
        >
          {/* Top rule */}
          <div className="w-full h-px bg-teal-400/30" />

          <div className="flex flex-col items-center gap-1">
           
              <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-3xl"
          >🌿</motion.div>
           <p className="font-serif italic text-teal-100 text-xl text-center leading-snug tracking-wide">
              Moodyfy
            </p>
            <p className="font-serif italic text-teal-300/55 text-[11px] text-center tracking-widest uppercase">
              Every feeling has a page
            </p>
          </div>

          {/* Time label */}
          <div className="flex items-center gap-2 w-full justify-center">
            <div className="flex-1 h-px bg-teal-400/20" />
            <p className="text-[9px] text-teal-300/40 font-mono tracking-widest uppercase">
              {timeLabel}
            </p>
            <div className="flex-1 h-px bg-teal-400/20" />
          </div>

          {/* Bottom rule */}
          <div className="w-full h-px bg-teal-400/30" />
        </div>
      </motion.div>

      {/* Tap hint */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-teal-300/60 text-xs tracking-widest uppercase font-light"
        >
          tap to begin your day
        </motion.div>
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-teal-200/40 text-lg"
        >
          ↑
        </motion.div>
      </motion.div>

      {/* Date stamp bottom-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-8 right-8 text-right"
      >
        <p className="font-mono text-[10px] text-teal-300/30 tracking-widest">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DashboardDiaryCover;