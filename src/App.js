import React from "react";
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

  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        {/* Brand */}
        <Link to="/" style={styles.brand}>
          ShopSphere
        </Link>

        {/* Right Navigation */}
        <nav style={styles.nav}>
          <Link to="/cart" style={styles.navLink}>
            Cart ({totalItems})
          </Link>

          {user ? (
            <>
              <Link to="/orders" style={styles.navLink}>
                My Orders
              </Link>

              <span style={styles.userText}>Hello, {user.name}</span>

              {isAdminUser(user) && (
                <>
                  <Link to="/admin/products" style={styles.navLink}>
                    Products
                  </Link>
                  <Link to="/admin/products/new" style={styles.navLink}>
                    Add Product
                  </Link>
                  <Link to="/admin/orders" style={styles.navLink}>
                    Orders
                  </Link>
                </>
              )}

              <button onClick={logout} style={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>
                Login
              </Link>
              <Link to="/register" style={styles.navLink}>
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
    <div style={styles.appShell}>
      <Header />
      <main style={styles.main}>{children}</main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
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

const styles = {
  appShell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f9fafb",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: {
    fontSize: 22,
    fontWeight: 800,
    textDecoration: "none",
    color: "#4f46e5",
    letterSpacing: "0.02em",
  },
  nav: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  navLink: {
    fontSize: 14,
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: 500,
  },
  userText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: 500,
  },
  logoutButton: {
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  footer: {
    marginTop: "auto",
    padding: "12px 20px",
    fontSize: 12,
    textAlign: "center",
    color: "#6b7280",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  footerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
};

export default App;
