import { Routes, Route } from "react-router-dom";

// =========================
// COMPONENTS
// =========================
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// =========================
// CUSTOMER PAGES
// =========================
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

// =========================
// ADMIN PAGES
// =========================
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";

// =========================
// OTHER
// =========================
import NotFound from "./pages/NotFound";


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* =========================
          NAVBAR
      ========================= */}
      <Navbar />

      {/* Scroll to top on route change */}
      <ScrollToTopOnRouteChange />

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="flex-grow">

        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Products */}
          <Route
            path="/products"
            element={<Products />}
          />

          {/* Product Details */}
          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          {/* Cart */}
          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* Forgot Password */}
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />


          {/* =========================
              PROTECTED CUSTOMER ROUTES
          ========================= */}

          {/* Wishlist */}
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Checkout */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Order Success */}
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* My Orders */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />


          {/* =========================
              ADMIN ROUTES
          ========================= */}

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Admin Order Management */}
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          {/* Admin Product Management */}
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />


          {/* =========================
              404 PAGE
          ========================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </main>

      {/* =========================
          FOOTER
      ========================= */}
      <Footer />

      {/* Scroll to top button */}
      <ScrollToTop />

    </div>
  );
}

export default App;