import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { toast } from "react-toastify";

import { auth } from "../firebase";

// NexCart Logo
import nexcartLogo from "../assets/logo/nexcart-logo.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          const from =
            location.state?.from?.pathname || "/";

          navigate(from, { replace: true });
        }
      }
    );

    return () => unsubscribe();
  }, [navigate, location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      toast.success("Welcome back to NexCart!");

      const from =
        location.state?.from?.pathname || "/";

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        toast.error("Invalid email or password.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error(
          "Too many attempts. Please try again later."
        );
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error(
          error.message || "Unable to login."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070711] text-white">

      {/* =========================
          BACKGROUND GLOWS
      ========================== */}
      <div className="pointer-events-none absolute left-[-150px] top-[-150px] h-[550px] w-[550px] rounded-full bg-purple-600/20 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-150px] right-[-150px] h-[550px] w-[550px] rounded-full bg-fuchsia-600/15 blur-[150px]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">

          {/* =========================
              LEFT BRAND SECTION
          ========================== */}
          <div className="hidden lg:block">

            {/* Logo */}
            <Link
              to="/"
              className="mb-8 inline-flex items-center transition duration-300 hover:scale-[1.02]"
            >
              <img
                src={nexcartLogo}
                alt="NexCart"
                className="h-16 w-auto object-contain"
              />
            </Link>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              <Sparkles size={15} />
              Welcome to NexCart
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
              Shop smarter.
              <br />

              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Live better.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
              Your premium shopping experience starts here.
              Discover products, save your favorites and manage
              every order from one place.
            </p>

            {/* Feature Cards */}
            <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                <ShoppingBag
                  size={23}
                  className="mb-3 text-purple-400"
                />

                <h3 className="font-semibold">
                  Premium Shopping
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Discover products you'll love.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                <ShieldCheck
                  size={23}
                  className="mb-3 text-emerald-400"
                />

                <h3 className="font-semibold">
                  Secure Account
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Your account stays protected.
                </p>
              </div>

            </div>
          </div>

          {/* =========================
              LOGIN CARD
          ========================== */}
          <div className="mx-auto w-full max-w-md">

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-2xl shadow-purple-950/30 backdrop-blur-2xl">

              {/* Card Header */}
              <div className="p-7 pb-5 sm:p-9 sm:pb-5">

                {/* Mobile Logo */}
                <div className="mb-7 flex justify-center lg:hidden">

                  <Link
                    to="/"
                    className="inline-flex items-center"
                  >
                    <img
                      src={nexcartLogo}
                      alt="NexCart"
                      className="h-14 w-auto object-contain"
                    />
                  </Link>

                </div>

                {/* Login Icon */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
                  <LogIn
                    size={22}
                    className="text-purple-400"
                  />
                </div>

                <h2 className="text-3xl font-black">
                  Welcome Back
                </h2>

                <p className="mt-2 text-gray-400">
                  Login to continue shopping on NexCart.
                </p>

              </div>

              {/* =========================
                  LOGIN FORM
              ========================== */}
              <form
                onSubmit={handleSubmit}
                className="px-7 pb-8 sm:px-9"
              >

                {/* Email */}
                <div className="mb-5">

                  <label className="mb-2 block text-sm text-gray-400">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                    />

                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">

                  <div className="mb-2 flex items-center justify-between">

                    <label className="block text-sm text-gray-400">
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs text-purple-400 transition hover:text-purple-300"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 transition hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>
                </div>

                {/* Security Info */}
                <div className="mb-6 mt-5 flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-400"
                  />

                  Secure Firebase authentication
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 py-3.5 font-bold shadow-xl shadow-purple-900/30 transition hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Signing In...
                    </>
                  ) : (
                    <>
                      Login to NexCart
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>

              {/* Signup */}
              <div className="border-t border-white/10 p-6 text-center">

                <p className="text-sm text-gray-500">
                  Don't have an account?
                </p>

                <Link
                  to="/signup"
                  className="mt-2 inline-flex items-center gap-1.5 font-semibold text-purple-400 transition hover:text-purple-300"
                >
                  Create your account
                  <ArrowRight size={15} />
                </Link>

              </div>

            </div>

            {/* Back Home */}
            <div className="mt-6 text-center">

              <Link
                to="/"
                className="text-sm text-gray-600 transition hover:text-gray-300"
              >
                ← Back to NexCart
              </Link>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;