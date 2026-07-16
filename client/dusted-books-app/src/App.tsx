import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./context/themeContext";
import { CartProvider } from "./context/cartContext";

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
import Browse from "./pages/Browse";
import Cart from "./pages/Cart";
import BookDetails from "./pages/BookDetails";
import MyRequests from "./pages/CustomerLayout/MyRequests";
import RequestManagement from "./components/admin/requests/RequestManagement";
import SellBook from "./pages/CustomerLayout/SellBook";
import MySellRequests from "./pages/CustomerLayout/MySellRequests";
import SellRequestManagement from "./components/admin/sell-requests/SellRequestManagement";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
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
                path="/browse"
                element={
                  <ProtectedRoute>
                    <Browse />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/books/:id"
                element={
                  <ProtectedRoute>
                    <BookDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-requests"
                element={
                  <ProtectedRoute>
                    <MyRequests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sell-book"
                element={
                  <ProtectedRoute>
                    <SellBook />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-sell-requests"
                element={
                  <ProtectedRoute>
                    <MySellRequests />
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
                {/* request-routes */}
                <Route path="requests" element={<RequestManagement />} />
                {/* sell-request-routes */}
                <Route path="sell-requests" element={<SellRequestManagement />} />
              </Route>

              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
