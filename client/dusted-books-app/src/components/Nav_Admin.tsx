import { useState } from "react";
import { NavLink, useMatch } from "react-router-dom";
import { useAuth } from "../context/authContext";

function NavAdmin() {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isUserSectionActive = useMatch("/admin/users/*");
  const isBookSectionActive = useMatch("/admin/books/*");

  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `block py-2 px-4 transition-colors ${
      isActive
        ? "bg-white/30 font-semibold border-l-4 border-black"
        : "hover:bg-black/10 text-zinc-700"
    }`;

  const subLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `pl-10 block py-2 px-4 transition-colors ${
      isActive ? "bg-white/10 " : "hover:bg-black/10 text-zinc-700"
    }`;

  return (
    <>
      
      <button
        type="button"
        className="fixed left-4 top-4 z-50 inline-flex items-center justify-center rounded-md bg-olive-500 p-3 text-black shadow-md xl:hidden"
        aria-label="Toggle admin navigation"
        aria-expanded={isMobileOpen}
        onClick={() => setIsMobileOpen((current) => !current)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      
      <div
        className={`nav-admin fixed inset-y-0 left-0 z-40 flex h-screen w-4/5 max-w-[320px] flex-col bg-olive-300 text-black shadow-xl transition-transform duration-300 ease-out  xl:w-1/6 xl:max-w-none xl:translate-x-0 xl:shadow-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div id="top-nav" className="flex flex-1 flex-col">
          <div className="m-4 flex h-1/8 items-center justify-center">
            <h1 className="font-bold">DUSTEDBOOKS Admin</h1>
          </div>

          <div className="flex flex-col">
            <NavLink to="/admin/users/create" className={linkStyles} onClick={() => setIsMobileOpen(false)}>
              User Management
            </NavLink>

            <div className={`flex flex-col ${isUserSectionActive ? "block" : "hidden"}`}>
              <NavLink to="/admin/users/create" className={subLinkStyles} onClick={() => setIsMobileOpen(false)}>
                Create User
              </NavLink>
            </div>

            <NavLink to="/admin/books/add" className={linkStyles} onClick={() => setIsMobileOpen(false)}>
              Book Management
            </NavLink>

            <div className={`flex flex-col ${isBookSectionActive ? "block" : "hidden"}`}>
              <NavLink to="/admin/books/add" className={subLinkStyles} onClick={() => setIsMobileOpen(false)}>
                Add Book
              </NavLink>
            </div>
          </div>
        </div>

        
        <div id="btm-nav" className="mt-auto flex flex-col gap-3 bg-olive-500 p-4 xl:flex-row xl:items-center xl:justify-between xl:gap-2">
          <div className="flex items-center gap-3 text-white min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
              <span className="font-bold text-black">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold w-full">{user?.email}</h1>
              <h1 className="text-xs capitalize text-white/70">{user?.role}</h1>
            </div>
          </div>

          <button
            onClick={logout}
            className="cursor-pointer text-center rounded bg-black/80 px-3 py-1.5 text-sm text-white transition-colors hover:bg-black w-full xl:w-auto whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>

      
      {isMobileOpen ? (
        <button
          type="button"
          aria-label="Close admin navigation overlay"
          className="fixed inset-0 z-30 cursor-default bg-black/40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}
    </>
  );
}

export default NavAdmin;