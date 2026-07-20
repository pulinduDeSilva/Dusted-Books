import Nav from "../../components/Nav";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fcfaf8] text-amber-950 font-sans selection:bg-amber-900 selection:text-white dark:bg-gray-950 dark:text-amber-100 scroll-smooth">
      <Nav />

      <main id="customer-interface" className="w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default Home;
