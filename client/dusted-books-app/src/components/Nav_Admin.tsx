import { useState, useEffect } from "react";
import { NavLink, useMatch, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTheme } from "../context/themeContext";

// Sun icon
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7Z" />
    </svg>
  );
}

// Moon icon
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

function NavAdmin() {

  const nav = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const isUserSectionActive = useMatch("/admin/users/*");
  const isBookSectionActive = useMatch("/admin/books/*");

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `block py-2.5 px-4 transition-all duration-200 ${isActive
      ? "c dark:bg-white/10 bg-white/50 font-medium border-l-4 border-black/75 dark:border-amber-400 text-black dark:text-amber-300"
      : "hover:bg-olive-500/20 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 border-l-4 border-transparent hover:border-black/30 dark:hover:border-amber-400/50"
    }`;

  const subLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `pl-10 block py-2 px-4 transition-all duration-200 text-sm ${isActive
      ? "bg-white/20 dark:bg-white/10 font-medium text-black dark:text-amber-300 border-l-4 border-black/50 dark:border-amber-400"
      : "hover:bg-white/10 text-zinc-700 dark:text-zinc-300 border-l-4 border-transparent"
    }`;

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 inline-flex items-center justify-center rounded-md bg-olive-500 dark:bg-gray-700 p-2.5 text-black dark:text-white shadow-md xl:hidden hover:bg-olive-600 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle admin navigation"
        aria-expanded={isMobileOpen}
        onClick={() => setIsMobileOpen((current) => !current)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={`nav-admin fixed inset-y-0 left-0 z-40 flex h-screen w-4/5 max-w-[280px] flex-col bg-olive-300 dark:bg-gray-900 text-black dark:text-gray-100 shadow-2xl transition-transform duration-300 ease-in-out xl:w-1/5 xl:max-w-none xl:translate-x-0 xl:shadow-none ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div id="top-nav" className="flex flex-1 flex-col overflow-y-auto">
          <div className="m-4 flex items-center justify-center py-4 border-b border-black/10 dark:border-gray-700">
            <h1 className="font-bold antialiased text-lg tracking-wider dark:text-white tracking-tight">DUSTEDBOOKS <span className="font-light">Admin</span></h1>
          </div>

          <nav className="flex flex-col py-2">
            <NavLink to="/admin/users/create" className={linkStyles}>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                User Management
              </div>
            </NavLink>

            <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isUserSectionActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <NavLink to="/admin/users/create" className={subLinkStyles}>
                Create User
              </NavLink>
            </div>

            <NavLink to="/admin/books/add" className={linkStyles}>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Book Management
              </div>
            </NavLink>

            <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isBookSectionActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              <NavLink to="/admin/books/add" className={subLinkStyles}>
                Add Book
              </NavLink>
            </div>
          </nav>
        </div>

        <div className="flex items-center m-4  justify-center gap-4 text-black/60">
          <button className="cursor-pointer p-2 hover:bg-white/70 bg-black/10 border-1 border-black/5 rounded-lg w-full shadow-[0_0px_6px_rgba(0,0,0,0.1)]" onClick={() => nav("/")}>
            <h1>User View</h1>
          </button>
        </div>

        <div id="btm-nav" className="mt-auto flex flex-col gap-4 bg-olive-500 dark:bg-gray-800 p-5 xl:flex-row xl:items-center xl:justify-between xl:gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">

          <div className="flex items-center gap-3 text-white min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-inner">
              <span className="font-bold text-lg text-olive-600 dark:text-amber-400">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold w-full" title={user?.email}>{user?.email}</h1>
              <h1 className="text-xs capitalize text-white/80 dark:text-gray-400 font-medium tracking-wide">{user?.role || "Admin"}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full xl:w-auto">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-black/20 dark:bg-white/10 text-white hover:bg-black/30 dark:hover:bg-white/20 transition-colors"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              onClick={logout}
              className="cursor-pointer flex-1 text-center rounded-md bg-black/80 dark:bg-red-900/60 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black dark:hover:bg-red-800 hover:shadow-lg whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close admin navigation overlay"
          className="fixed inset-0 z-30 cursor-default bg-black/50 backdrop-blur-sm transition-opacity xl:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}

export default NavAdmin;