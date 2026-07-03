import { Link } from "react-router-dom";
import activeTabs from "../enums/activeTabs";

function NavAdmin({
  currentTab,
  onLinkClick,
}: {
  currentTab: string;
  onLinkClick: (tab: string) => void;
}) {
  return (
    <>
      <div className="nav-admin flex flex-col min-h-screen h-screen w-1/6 bg-black/10 text-black p-4">
        <div className="h-1/8 flex items-center justify-center m-4">
          <h1>DustedBooks Admin</h1>
        </div>
        <div className="h-full flex flex-col justify-start gap-2">
          <Link
            onClick={() => {
              onLinkClick(activeTabs.USER_MANAGEMENT);
            }}
            className={`block py-2 px-4 rounded-lg transition-colors ${
              currentTab === activeTabs.USER_MANAGEMENT
                ? "bg-white font-semibold"
                : " hover:bg-black/10"
            }`}
            to="/"
          >
            User Management
          </Link>

          <Link
            onClick={() => {
              onLinkClick(activeTabs.BOOK_MANAGEMENT);
            }}
            className={`block py-2 px-4 rounded-lg transition-colors ${
              currentTab === activeTabs.BOOK_MANAGEMENT
                ? "bg-white font-semibold"
                : " hover:bg-black/10"
            }`}
            to="/"
          >
            Book Management
          </Link>
        </div>
      </div>
    </>
  );
}

export default NavAdmin;
