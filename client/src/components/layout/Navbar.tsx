import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Logo from "../Logo";

const appLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Journal", to: "/journal" },
  { label: "Insights", to: "/insights" },
  { label: "Gratitude", to: "/gratitude" },
];

const publicLinks = [
  { label: "Features", to: "/features" },
  { label: "About", to: "/about" },
];

const authPages = ["/login", "/signup"];

interface NavbarProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Navbar = ({ isLoggedIn = false, onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAuthPage = authPages.includes(pathname);

  // read user from localStorage for avatar
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  // shared NavLink className factory with rounded border and light shadow
  const linkClass = ({ isActive }: { isActive: boolean }) => `
    rounded-full px-5 py-2
    font-serif text-sm font-light tracking-wide
    transition-all duration-300
    shadow-sm
    hover:shadow-md hover:scale-105 hover:text-[rgb(3_131_153)]
    ${
      isActive
        ? "bg-[rgb(3_131_153/0.12)] text-[rgb(3_131_153)] font-medium shadow-md"
        : "bg-white text-slate-600 hover:bg-white"
    }
  `;

  return (
    <nav
      className="
        sticky top-0 z-50
        border-b border-slate-100
        bg-white/80 backdrop-blur-md 
      "
    >
      <div
        className="
          mx-auto flex max-w-7xl
          items-center justify-between
          px-4 py-3 sm:px-6 lg:px-8
        "
      >
        <Logo isLoggedIn={isLoggedIn} />

        {/* NAV LINKS — hidden entirely on login/signup */}
        {!isAuthPage && (
          <div className="hidden items-center gap-2 md:flex">
            {isLoggedIn
              ? appLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={linkClass}>
                    {link.label}
                  </NavLink>
                ))
              : publicLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={linkClass}>
                    {link.label}
                  </NavLink>
                ))}
          </div>
        )}

        {/* RIGHT SIDE BUTTONS — hidden entirely on login/signup */}
        {!isAuthPage && (
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                

                {/* Avatar */}
                <div
                  onClick={() => navigate("/profile")}
                  className="
                    flex h-9 w-9 cursor-pointer items-center justify-center
                    rounded-full bg-[rgb(3_131_153/0.1)] shadow-sm
                    font-serif text-sm font-medium text-[rgb(3_131_153)]
                    transition-all duration-200 hover:bg-[rgb(3_131_153/0.18)] hover:shadow-md
                  "
                  title="Profile"
                >
                  {initials}
                </div>

                {/* Logout */}
                <button
                  onClick={onLogout}
                  className="
                    rounded-full border border-slate-200
                    px-5 py-2 font-serif text-sm font-light
                    tracking-wide text-slate-600 shadow-sm
                    transition-all duration-300
                    hover:bg-slate-50 hover:shadow-md hover:text-[rgb(3_131_153)]
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <NavLink
                  to="/login"
                  className={({ isActive }) => `
                    hidden sm:block rounded-full px-5 py-2
                    font-serif text-sm font-light tracking-wide
                    transition-all duration-300 shadow-sm
                    hover:bg-slate-50 hover:shadow-md hover:text-[rgb(3_131_153)]
                    ${isActive ? "text-[rgb(3_131_153)] bg-slate-50" : "text-slate-600"}
                  `}
                >
                  Login
                </NavLink>

                {/* Get Started */}
                <NavLink
                  to="/signup"
                  className={({ isActive }) => `
                    rounded-full px-6 py-2.5
                    font-serif text-sm font-medium tracking-wide text-white
                    transition-all duration-300 hover:shadow-md active:scale-95
                    ${
                      isActive
                        ? "bg-[rgb(2_100_120)] shadow-md"
                        : "bg-[rgb(3_131_153)] hover:bg-[rgb(2_100_120)]"
                    }
                  `}
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        )}

        {/* On auth pages — only logo shows, spacer keeps it left-aligned */}
        {isAuthPage && <div />}
      </div>
    </nav>
  );
};

export default Navbar;
