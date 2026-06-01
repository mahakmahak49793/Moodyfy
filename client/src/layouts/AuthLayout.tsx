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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[rgb(3,131,153)] shadow-lg shadow-[rgb(3,131,153)]/30 mb-4">
           
              <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
        style={{ background: "rgb(3 131 153)" }}
      >
        🌿
      </div>
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