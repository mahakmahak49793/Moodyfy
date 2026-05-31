import { useNavigate } from "react-router-dom";

interface LogoProps {
  isLoggedIn?: boolean;
  showSubtitle?: boolean;
}

const Logo = ({ isLoggedIn = false, showSubtitle = true }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
        style={{ background: "rgb(3 131 153)" }}
      >
        🌿
      </div>
      <div>
        <h1 className="font-serif text-xl font-medium tracking-wide text-slate-800">
          Moodyfy
        </h1>
        {showSubtitle && (
          <p className="hidden text-xs font-light text-slate-500 sm:block">
            Emotional wellness journal
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;