import { useEffect, useState } from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";

import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Home,
  Store,
} from "lucide-react";

import { toast } from "react-toastify";

import { auth } from "../firebase";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// NexCart Logo
import nexcartLogo from "../assets/logo/nexcart-logo.png";
import nexcartIcon from "../assets/logo/nexcart-icon.png";

const ADMIN_EMAIL = "devanshjat342@gmail.com";

function Navbar() {
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      closeMobile();

      toast.success("Logged out successfully.");

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);

      toast.error("Logout failed.");
    }
  };

  const navClass = ({ isActive }) =>
    `relative rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-white/[0.08] text-white"
        : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#070711]/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">

            {/* =========================
                LOGO
            ========================== */}
            <Link
              to="/"
              onClick={closeMobile}
              className="group flex items-center shrink-0"
              aria-label="NexCart Home"
            >
              {/* Desktop / Tablet Logo */}
              <img
                src={nexcartLogo}
                alt="NexCart"
                className="hidden h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:block"
              />

              {/* Mobile Icon */}
              <img
                src={nexcartIcon}
                alt="NexCart"
                className="block h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105 sm:hidden"
              />
            </Link>

            {/* =========================
                DESKTOP NAVIGATION
            ========================== */}
            <nav className="hidden items-center gap-1 lg:flex">
              <NavLink
                to="/"
                className={navClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                className={navClass}
              >
                Products
              </NavLink>

              {user && (
                <NavLink
                  to="/orders"
                  className={navClass}
                >
                  Orders
                </NavLink>
              )}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={navClass}
                >
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard size={15} />
                    Admin
                  </span>
                </NavLink>
              )}
            </nav>

            {/* =========================
                DESKTOP ACTIONS
            ========================== */}
            <div className="hidden items-center gap-2 lg:flex">

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition hover:border-pink-400/20 hover:bg-pink-500/10 hover:text-pink-300"
                title="Wishlist"
              >
                <Heart
                  size={18}
                  className="transition group-hover:scale-110"
                />

                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[#070711] bg-pink-500 px-1 text-[9px] font-black text-white">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition hover:border-purple-400/20 hover:bg-purple-500/10 hover:text-purple-300"
                title="Cart"
              >
                <ShoppingCart
                  size={18}
                  className="transition group-hover:scale-110"
                />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[#070711] bg-purple-500 px-1 text-[9px] font-black text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="ml-2 flex items-center gap-2 border-l border-white/10 pl-3">

                  <Link
                    to="/profile"
                    className="group flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-white/[0.05]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-xs font-black text-white">
                      {(user.displayName || user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="hidden xl:block">
                      <p className="max-w-[110px] truncate text-xs font-semibold text-slate-200">
                        {user.displayName || "Account"}
                      </p>

                      <p className="max-w-[110px] truncate text-[10px] text-slate-600">
                        {user.email}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                    title="Logout"
                  >
                    <LogOut size={17} />
                  </button>
                </div>
              ) : (
                <div className="ml-2 flex items-center gap-2 border-l border-white/10 pl-3">

                  <Link
                    to="/login"
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:-translate-y-0.5 hover:shadow-purple-900/40"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* =========================
                MOBILE ACTIONS
            ========================== */}
            <div className="flex items-center gap-2 lg:hidden">

              {/* Mobile Cart */}
              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300"
                aria-label="Cart"
              >
                <ShoppingCart size={18} />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-[#070711] bg-purple-500 px-1 text-[8px] font-black">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() =>
                  setMobileOpen((previous) => !previous)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300 transition hover:bg-white/[0.08]"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X size={20} />
                ) : (
                  <Menu size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            MOBILE MENU
        ========================== */}
        <div
          className={`overflow-hidden border-t border-white/[0.06] bg-[#090912]/95 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
            mobileOpen
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="grid gap-2">

              {/* Home */}
              <Link
                to="/"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-300"
              >
                <Home size={17} />
                Home
              </Link>

              {/* Products */}
              <Link
                to="/products"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-300"
              >
                <Store size={17} />
                Products
              </Link>

              {user && (
                <>
                  {/* Orders */}
                  <Link
                    to="/orders"
                    onClick={closeMobile}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-300"
                  >
                    <span className="flex items-center gap-3">
                      <Package size={17} />
                      Orders
                    </span>
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    onClick={closeMobile}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-300"
                  >
                    <span className="flex items-center gap-3">
                      <Heart size={17} />
                      Wishlist
                    </span>

                    {wishlistCount > 0 && (
                      <span className="rounded-full bg-pink-500/15 px-2 py-0.5 text-[10px] font-bold text-pink-300">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={closeMobile}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-300"
                  >
                    <User size={17} />
                    Profile
                  </Link>
                </>
              )}

              {/* Admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMobile}
                  className="flex items-center gap-3 rounded-xl border border-purple-400/10 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-300"
                >
                  <LayoutDashboard size={17} />
                  Admin Dashboard
                </Link>
              )}

              <div className="my-2 h-px bg-white/[0.06]" />

              {/* Auth */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-xl border border-red-400/10 bg-red-500/[0.05] px-4 py-3 text-sm font-semibold text-red-300"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">

                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-slate-300"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMobile}
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Sign Up
                  </Link>

                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;