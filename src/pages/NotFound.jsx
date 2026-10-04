import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#070711] text-white relative overflow-hidden flex items-center justify-center px-6">

      {/* Background Glows */}
      <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="absolute bottom-[-180px] left-[-120px] w-[450px] h-[450px] bg-fuchsia-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="absolute top-[40%] right-[-150px] w-[400px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-3xl w-full text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-sm mb-7">
          <Sparkles size={15} />
          NexCart
        </div>

        {/* 404 */}
        <div className="relative">

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 bg-purple-600/10 blur-[90px] rounded-full" />
          </div>

          <h1 className="relative text-[110px] sm:text-[160px] leading-none font-black tracking-tighter bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            404
          </h1>

        </div>

        {/* Icon */}
        <div className="mx-auto -mt-3 mb-7 w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl">
          <Search
            size={34}
            className="text-purple-400"
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black">
          Page Not Found
        </h2>

        <p className="text-gray-400 max-w-lg mx-auto mt-4 leading-relaxed">
          Looks like you've wandered somewhere outside the NexCart
          shopping universe. The page you're looking for doesn't exist
          or may have been moved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 font-semibold shadow-xl shadow-purple-900/30 transition"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] font-semibold transition"
          >
            <ShoppingBag size={18} />
            Explore Products
            <ArrowRight size={17} />
          </Link>

        </div>

        {/* Quick Links */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6">

          <p className="text-sm text-gray-500 mb-4">
            Quick navigation
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">

            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              Cart
            </Link>

            <Link
              to="/wishlist"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              Wishlist
            </Link>

          </div>
        </div>

        {/* Back */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-7 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-300 transition"
        >
          <ArrowLeft size={15} />
          Go back
        </button>

        {/* Logo */}
        <div className="mt-10 flex items-center justify-center gap-2 text-gray-600">

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 border border-purple-400/10 flex items-center justify-center">
            <ShoppingBag size={15} />
          </div>

          <span className="font-bold">
            NexCart
          </span>

        </div>

      </div>
    </div>
  );
}

export default NotFound;