import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/authContext";

import ProtectedRoute from "./routes/protected";
import GuestRoute from "./routes/GuestRoutes";
import AdminRoute from "./routes/adminRoutes";

import Home from "./pages/CustomerLayout/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminLayout/Admin";

import Unauthorized from "./pages/Unauthorized";
import UserManagement from "./components/admin/user/UserManagement";
import BookManagement from "./components/admin/book/BookManagement";
import UserCreateForm from "./components/admin/user/UserCreateForm";
import BookUpload from "./components/admin/book/BookUpload";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="users/create" replace />} />

            {/* user-routes */}
            <Route path="users" element={<UserManagement />}> 
              <Route path="create" element={<UserCreateForm />} ></Route>
            </Route>
            {/* book-routes */}
            <Route path="books" element={<BookManagement />} >
              <Route path="add" element={<BookUpload />} ></Route>
            </Route>
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
