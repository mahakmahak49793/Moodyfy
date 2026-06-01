import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import Logo from "../Logo";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/authSlice";

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

const authPages = ["/login", "/signup", "/verify-otp"];

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector((state) => !!state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";
  const isAuthPage = authPages.includes(pathname);
  const isVerifyOtp = pathname === "/verify-otp";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) => `
    rounded-full px-5 py-2
    font-serif text-sm font-light tracking-wide
    transition-all duration-300 shadow-sm
    hover:shadow-md hover:scale-105 hover:text-[rgb(3,131,153)]
    ${
      isActive
        ? "bg-[rgb(3,131,153)]/10 text-[rgb(3,131,153)] font-medium shadow-md"
        : "bg-white text-slate-600 hover:bg-white"
    }
  `;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) => `
    block w-full rounded-2xl px-4 py-3
    font-serif text-sm font-light tracking-wide
    transition-all duration-200
    ${
      isActive
        ? "bg-[rgb(3,131,153)]/10 text-[rgb(3,131,153)] font-medium"
        : "text-slate-600 hover:bg-slate-50 hover:text-[rgb(3,131,153)]"
    }
  `;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          <Logo isLoggedIn={isLoggedIn} />

          {/* DESKTOP NAV LINKS */}
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

          {/* RIGHT SIDE */}
          {!isAuthPage && (
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  {/* Avatar — always visible */}
                  <div
                    onClick={() => navigate("/dashboard")}
                    className="
                      flex h-9 w-9 cursor-pointer items-center justify-center
                      rounded-full bg-[rgb(3,131,153)]/10 shadow-sm
                      font-serif text-sm font-medium text-[rgb(3,131,153)]
                      transition-all duration-200 hover:bg-[rgb(3,131,153)]/20 hover:shadow-md
                    "
                    title="Profile"
                  >
                    {initials}
                  </div>

                  {/* Logout — always visible */}
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="
                      flex items-center justify-center
                      h-9 w-9 rounded-full
                      text-rose-500 hover:bg-rose-50 hover:text-rose-700
                      transition-all duration-200
                    "
                    title="Logout"
                  >
                    <LogOut size={17} />
                  </button>

                  {/* Mobile hamburger — nav links only */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="
                      md:hidden flex items-center justify-center
                      h-9 w-9 rounded-full
                      text-slate-600 hover:bg-slate-100
                      transition-all duration-200
                    "
                  >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                      hover:bg-slate-50 hover:shadow-md hover:text-[rgb(3,131,153)]
                      ${isActive ? "text-[rgb(3,131,153)] bg-slate-50" : "text-slate-600"}
                    `}
                  >
                    Login
                  </NavLink>

                  {/* Get Started */}
                  {!isVerifyOtp && (
                    <NavLink
                      to="/signup"
                      className={({ isActive }) => `
                        rounded-full px-6 py-2.5
                        font-serif text-sm font-medium tracking-wide text-white
                        transition-all duration-300 hover:shadow-md active:scale-95
                        ${isActive ? "bg-[rgb(2,100,120)] shadow-md" : "bg-[rgb(3,131,153)] hover:bg-[rgb(2,100,120)]"}
                      `}
                    >
                      Get Started
                    </NavLink>
                  )}

                  {/* Mobile hamburger — public links */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="
                      md:hidden flex items-center justify-center
                      h-9 w-9 rounded-full
                      text-slate-600 hover:bg-slate-100
                      transition-all duration-200
                    "
                  >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </>
              )}
            </div>
          )}

          {isAuthPage && <div />}
        </div>

        {/* MOBILE DROPDOWN — nav links only */}
        {!isAuthPage && mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1">
            {isLoggedIn
              ? appLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={mobileLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))
              : publicLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={mobileLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
          </div>
        )}
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
                <LogOut className="h-6 w-6 text-rose-500" />
              </div>
            </div>
            <h2 className="text-center text-lg font-semibold text-slate-800 font-serif">
              Logging out?
            </h2>
            <p className="text-center text-sm font-light text-slate-500 mt-1 mb-6">
              You'll need to sign in again to access your journal and insights.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="
                  flex-1 rounded-2xl border border-slate-200
                  py-2.5 font-serif text-sm font-light text-slate-600
                  hover:bg-slate-50 transition-all duration-200
                "
              >
                Stay
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="
                  flex-1 rounded-2xl bg-rose-500
                  py-2.5 font-serif text-sm font-medium text-white
                  hover:bg-rose-600 transition-all duration-200 active:scale-95
                "
              >
                Yes, logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;