import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";

import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddProductPage from "./pages/AddProductPage";
import AdminProductListPage from "./pages/AdminProductListPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

// helper – user admin hai ya nahi
const isAdminUser = (user) => {
  if (!user) return false;
  if (user.role && typeof user.role === "string") {
    if (user.role.toLowerCase() === "admin") return true;
  }
  if (user.admin === true) return true;
  if (user.isAdmin === true) return true;
  return false;
};

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <Link to="/" className="brand" onClick={handleNavClick}>
          ShopSphere
        </Link>

        {/* Mobile menu button */}
        <button
          className="menu-button"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* Right Navigation */}
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/cart" className="nav-link" onClick={handleNavClick}>
            Cart ({totalItems})
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="nav-link" onClick={handleNavClick}>
                My Orders
              </Link>

              <span className="user-text">Hello, {user.name}</span>

              {isAdminUser(user) && (
                <>
                  <Link
                    to="/admin/products"
                    className="nav-link"
                    onClick={handleNavClick}
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/products/new"
                    className="nav-link"
                    onClick={handleNavClick}
                  >
                    Add Product
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="nav-link"
                    onClick={handleNavClick}
                  >
                    Orders
                  </Link>
                </>
              )}

              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                onClick={handleNavClick}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link"
                onClick={handleNavClick}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} ShopSphere</span>
          <span>Built with MERN Stack</span>
          <span>Developed by Sonu Nagpuriya</span>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Cart & Checkout – protected */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              {/* My Orders – protected */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrdersPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin – products list */}
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProductListPage />
                  </AdminRoute>
                }
              />

              {/* Admin – add product */}
              <Route
                path="/admin/products/new"
                element={
                  <AdminRoute>
                    <AddProductPage />
                  </AdminRoute>
                }
              />

              {/* Admin – orders */}
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrdersPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;