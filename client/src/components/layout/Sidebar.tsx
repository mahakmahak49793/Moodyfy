import type { ReactNode } from "react";

interface SidebarProps {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const Sidebar = ({
  title,
  subtitle,
  isOpen,
  onClose,
  children,
  className = "",
}: SidebarProps) => {
  return (
    <>
      <aside
        className={`
          fixed lg:relative z-40
          w-72 sm:w-80
          h-full transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col bg-white/20 backdrop-blur-md border-r border-white/30
          shadow-xl lg:shadow-none ${className}
        `}
      >
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 z-50 text-slate-600 hover:text-slate-800 bg-white/20 rounded-full p-1.5 backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="border-b border-white/30 px-4 sm:px-6 py-5 sm:py-6">
          <h1
            className="font-serif italic font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] mb-1"
            style={{ fontSize: "1.45rem", letterSpacing: "-0.01em", lineHeight: 1.2 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-light text-white/80 drop-shadow mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {children}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;