import React from "react";

// ─── Glass card ───────────────────────────────────────────────────────────────
export const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl bg-white/35 backdrop-blur-sm border border-white/50 shadow-md p-5 ${className}`}
  >
    {children}
  </div>
);

// ─── Section with visible label ───────────────────────────────────────────────
export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-7">
    <p className="text-xs font-semibold tracking-widest text-slate-700 uppercase mb-3 flex items-center gap-2">
      <span className="inline-block w-4 h-px bg-teal-500/60" />
      {title}
    </p>
    {children}
  </div>
);

// ─── Breathing loader ─────────────────────────────────────────────────────────
export const BreathingLoader = () => (
  <div className="flex flex-col items-center justify-center gap-6 py-24">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border border-teal-400/50 animate-ping" />
      <div className="absolute inset-2 rounded-full border border-teal-500/50 animate-ping [animation-delay:0.35s]" />
      <div className="absolute inset-4 rounded-full bg-teal-400/40 animate-pulse" />
    </div>
    <p className="font-serif italic text-slate-700 text-sm tracking-wide animate-pulse">
      Reading between the lines…
    </p>
  </div>
);