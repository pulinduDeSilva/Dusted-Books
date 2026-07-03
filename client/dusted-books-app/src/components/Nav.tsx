import { useState } from "react";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed block w-full  px-4 py-2 mx-auto l z-999">
      <div className="container flex flex-wrap items-center justify-between mx-auto text-white lg:w-[80%] bg-black/30 shadow-[0px_3px_10px_rgba(0,0,0,0.3)] rounded-md px-8 py-3 mt-4 lg:mt-10 backdrop-blur-sm border border-zinc-300/20">
        <a
          href="#"
          className="mr-4 block cursor-pointer py-1.5 text-base text-white font-semibold"
        >
          DustedBooks
        </a>

        <button
          type="button"
          className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="left-1/2 top-1/2 -tranwhite-x-1/2 -tranwhite-y-1/2 transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </span>
        </button>

        <div
          id="mobile-nav"
          className={`w-full overflow-hidden transition-all duration-300 ease-out lg:block lg:w-auto ${
            isOpen
              ? "max-h-96 opacity-100 tranwhite-y-0 mt-4"
              : "max-h-0 opacity-0 -tranwhite-y-2 pointer-events-none mt-0"
          } lg:max-h-none lg:opacity-100 lg:tranwhite-y-0 lg:mt-0 lg:pointer-events-auto`}
          aria-hidden={!isOpen}
        >
          <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <li className="flex items-center p-1 text-sm gap-x-2 text-white-600">
              
              <a href="#" className="flex items-center gap-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6 text-white-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
              Pages
              </a>
            </li>
            <li className="flex items-center p-1 text-sm gap-x-2 text-white">
              <a href="#" className="flex items-center gap-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
                Account
              </a>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
