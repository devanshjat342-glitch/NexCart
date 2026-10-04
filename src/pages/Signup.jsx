import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { toast } from "react-toastify";

import { auth, db } from "../firebase";

// NexCart Logo
import nexcartLogo from "../assets/logo/nexcart-logo.png";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          navigate("/", { replace: true });
        }
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (name.length < 2) {
      toast.error("Please enter a valid name.");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const newUser = userCredential.user;

      await updateProfile(newUser, {
        displayName: name,
      });

      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        name,
        email: newUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Account created successfully!");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error(
          "An account already exists with this email."
        );
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        toast.error(
          "Password is too weak. Use at least 6 characters."
        );
      } else {
        toast.error(
          error.message || "Unable to create account."
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
      <div className="pointer-events-none absolute right-[-150px] top-[-150px] h-[550px] w-[550px] rounded-full bg-fuchsia-600/20 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-150px] left-[-150px] h-[550px] w-[550px] rounded-full bg-purple-600/15 blur-[150px]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">

          {/* =========================
              LEFT BRAND
          ========================== */}
          <div className="order-2 hidden lg:block">

            {/* NexCart Logo */}
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

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-300">
              <Sparkles size={15} />
              Join NexCart
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
              Your shopping.
              <br />

              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Your world.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
              Create your NexCart account and unlock a smarter,
              faster and more personalized shopping experience.
            </p>

            {/* Benefits */}
            <div className="mt-10 max-w-lg space-y-4">

              {/* Wishlist */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
                  <Check
                    size={21}
                    className="text-purple-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Save your favorites
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Keep products you love in your wishlist.
                  </p>
                </div>

              </div>

              {/* Orders */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-500/10">
                  <Check
                    size={21}
                    className="text-fuchsia-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Track every order
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Follow your purchase from order to delivery.
                  </p>
                </div>

              </div>

              {/* Security */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <ShieldCheck
                    size={21}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Secure account
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Your account is protected by Firebase Authentication.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* =========================
              SIGNUP CARD
          ========================== */}
          <div className="order-1 mx-auto w-full max-w-md lg:order-1">

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-2xl shadow-purple-950/30 backdrop-blur-2xl">

              {/* Header */}
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

                {/* Icon */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10">
                  <UserPlus
                    size={22}
                    className="text-fuchsia-400"
                  />
                </div>

                <h2 className="text-3xl font-black">
                  Create Account
                </h2>

                <p className="mt-2 text-gray-400">
                  Join NexCart and start shopping smarter.
                </p>

              </div>

              {/* =========================
                  FORM
              ========================== */}
              <form
                onSubmit={handleSubmit}
                className="px-7 pb-8 sm:px-9"
              >

                {/* Name */}
                <div className="mb-5">

                  <label className="mb-2 block text-sm text-gray-400">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/10"
                    />

                  </div>
                </div>

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
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/10"
                    />

                  </div>
                </div>

                {/* Password */}
                <div className="mb-5">

                  <label className="mb-2 block text-sm text-gray-400">
                    Password
                  </label>

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
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/10"
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

                {/* Confirm Password */}
                <div className="mb-5">

                  <label className="mb-2 block text-sm text-gray-400">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 transition hover:text-white"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>
                </div>

                {/* Security */}
                <div className="mb-6 flex items-start gap-2 text-xs text-gray-500">

                  <ShieldCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />

                  <span>
                    Your account is securely created using Firebase
                    Authentication.
                  </span>

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

                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create NexCart Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>

              {/* Login */}
              <div className="border-t border-white/10 p-6 text-center">

                <p className="text-sm text-gray-500">
                  Already have an account?
                </p>

                <Link
                  to="/login"
                  className="mt-2 inline-flex items-center gap-1.5 font-semibold text-purple-400 transition hover:text-purple-300"
                >
                  Login to NexCart
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

export default Signup;