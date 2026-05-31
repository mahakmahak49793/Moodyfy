import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
}: AuthLayoutProps) => {
  return (
    <div className="py-10 flex items-center justify-center px-4 bg-gradient-to-br from-[rgb(3,131,153)]/5 via-white to-[rgb(3,131,153)]/10">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl shadow-[rgb(3, 131, 153)]/10 border border-[rgb(3,131,153)]/10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[rgb(3,131,153)] shadow-lg shadow-[rgb(3,131,153)]/30 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            {title}
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-light tracking-wide">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;