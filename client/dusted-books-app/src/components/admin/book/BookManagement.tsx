import { Outlet } from "react-router-dom";

function BookManagement() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4 text-zinc-800">Book Management</h1>
        <p>Welcome to Book Management where you can manage Books.</p>
        <aside>
            <Outlet />
        </aside>
      </div>
    </>
  );
}

export default BookManagement;
