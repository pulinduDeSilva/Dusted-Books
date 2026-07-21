import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import { useTheme } from "../context/themeContext";

// Sun icon
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7Z" />
    </svg>
  );
}

// Moon icon
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  {/*const { isDark, toggleTheme } = useTheme();*/}
  const location = useLocation();
  const dropdownRef = useRef<HTMLLIElement>(null);
  const isCartRoute = location.pathname === "/cart";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <nav 
      className={`fixed top-0 left-0 z-[999] w-full border-b border-amber-900/10 bg-white backdrop-blur-md transition-all duration-300 dark:border-gray-800 dark:bg-gray-950/80 py-2`}
    >
      <div className="flex w-full flex-col md:flex-row px-4 text-amber-950 dark:text-amber-100 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between gap-3 my-3 md:my-0">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3 mr-4 text-2xl font-bold tracking-wider text-amber-950 dark:text-amber-100 transition-transform duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
          >

            {/*  
            <span className="flex h-14 w-14 items-center justify-center rounded-full dark:bg-gray-800 dark:border-gray-700 p-0.5">
              <img
                src={logoImage}
                alt="DustedBooks logo"
                className="h-12 w-12 rounded-full object-cover"
              />
            </span>
            */}
            <span className="truncate text-amber-950/60 tracking-tight dark:from-amber-400 dark:to-amber-300 text-lg">
              DustedBooks
            </span>
          </Link>

          <div className="flex items-center ml-auto lg:hidden">
            {/* Theme toggle – mobile 
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-amber-950 dark:text-amber-200 hover:bg-amber-900/10 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            */}
            <button
              type="button"
              className=" h-10 w-10 select-none  transition-all  flex items-center justify-center dark:border-gray-700 text-amber-950 dark:text-amber-200"
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              onClick={() => {
                setIsOpen((current) => !current);
                if (accountDropdownOpen) setAccountDropdownOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          className={`w-full overflow-hidden lg:overflow-visible transition-all duration-300 ease-in-out lg:block lg:w-auto ${
            isOpen
              ? "max-h-[32rem] opacity-100 translate-y-0 mt-4 md:mt-0"
              : "max-h-0 opacity-0 -translate-y-4 lg:translate-y-0 lg:max-h-none lg:opacity-100 mt-0"
          }`}
          aria-hidden={!isOpen}
        >
          <ul className="flex flex-col gap-2 mx-3 my-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:justify-end lg:gap-8 lg:pb-0">
            <li className="flex items-center">
              <Link
                to="/"
                className="group flex w-full items-center gap-2 text-sm font-medium text-amber-950/70 dark:text-amber-200/70 hover:text-amber-950 dark:hover:text-amber-100 transition-all duration-200 py-2 relative hover:-translate-y-0.5 lg:w-auto"
              >
                <span>Home</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-950 dark:bg-amber-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            </li>

            <li className="flex items-center">
              <Link
                to="browse"
                className="group flex w-full items-center gap-2 text-sm font-medium text-amber-950/70 dark:text-amber-200/70 hover:text-amber-950 dark:hover:text-amber-100 transition-all duration-200 py-2 relative hover:-translate-y-0.5 lg:w-auto"
              >
                <span>Browse</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-950 dark:bg-amber-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            </li>

            {user && user.role === "admin" && (
              <li className="flex items-center">
                <Link 
                  to="/admin" 
                  className="group flex w-full items-center gap-2 text-sm font-medium text-amber-950/70 dark:text-amber-200/70 hover:text-amber-950 dark:hover:text-amber-100 transition-all duration-200 py-2 relative hover:-translate-y-0.5 lg:w-auto"
                >
                  
                  Admin
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-950 dark:bg-amber-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li className="flex items-center">
                  <Link
                    to="cart"
                    className={`group relative inline-flex items-center gap-2 rounded-full px-0 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                      isCartRoute
                        ? "bg-amber-900/10 text-amber-950 dark:bg-white/10 dark:text-amber-100"
                        : "text-amber-950/70 hover:text-amber-950 dark:text-amber-200/70 dark:hover:bg-white/10 dark:hover:text-amber-100"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 0 0 6.6 17H19m-12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                    Cart
                    {cartCount > 0 && (
                      <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-amber-700 px-2 text-xs font-semibold text-white">
                        {cartCount}
                      </span>
                    )}
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-amber-950 transition-all duration-300 group-hover:w-full dark:bg-amber-400" />
                  </Link>
                </li>

                {/* Theme toggle – desktop (in nav list) 
                <li className="hidden lg:flex items-center">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-amber-950/70 dark:text-amber-200/70 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-amber-900/10 dark:hover:bg-white/10 transition-all"
                  >
                    {isDark ? <SunIcon /> : <MoonIcon />}
                  </button>
                </li>
                */}
                <li className="relative flex flex-col lg:items-center" ref={dropdownRef}>
                  <button 
                    className="group flex w-full items-center gap-2 cursor-pointer text-sm font-medium text-amber-950/70 dark:text-amber-200/70 hover:text-amber-950 dark:hover:text-amber-100 transition-colors py-2 relative lg:w-auto" 
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    aria-haspopup="true"
                    aria-expanded={accountDropdownOpen}
                  >
                    <div className={`rounded-full transition-colors ${accountDropdownOpen ? 'bg-amber-900/10 dark:bg-white/10 text-amber-950 dark:text-amber-100' : 'bg-transparent'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                    Account
                  </button>
                
                <div 
                  id="account-dropdown" 
                  className={`w-full lg:absolute lg:right-0 lg:top-[120%] mt-2 lg:w-48 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-zinc-200 dark:border-gray-700 z-50 origin-top-right transition-all duration-200 ease-out ${
                    accountDropdownOpen ? "scale-100 opacity-100 visible translate-y-0 h-auto" : "scale-95 opacity-0 invisible -translate-y-2 h-0 overflow-hidden"
                  }`}
                >
                  <ul className="py-2">
                    <li>
                      <Link to="account" className="group relative flex items-center gap-2 w-full px-5 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-200 font-medium">
                        Profile
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-amber-950 transition-all duration-300 group-hover:w-full dark:bg-amber-400" />
                      </Link>
                    </li>
                    <div className="h-[1px] bg-gray-200/50 dark:bg-gray-700 my-1"></div>
                    <li>
                      <button className="flex items-center gap-2 w-full px-5 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 hover:translate-x-1 font-medium" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </>
            ) : (
              <li className="flex items-center mt-2 lg:mt-0 lg:ml-2">
                <Link to="/login" className="px-6 py-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 shadow-sm">
                  Log in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
