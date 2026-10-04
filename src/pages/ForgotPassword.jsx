import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import { toast } from "react-toastify";

import { auth } from "../firebase";
import nexcartLogo from "../assets/logo/nexcart-logo.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Intentionally no redirect.
        // User can still use this page if needed.
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, trimmedEmail);

      setSent(true);

      toast.success("Password reset email sent successfully.");
    } catch (error) {
      console.error("Password reset error:", error);

      if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account was found with this email.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(
          error.message || "Unable to send password reset email."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070711] text-white relative overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-[-150px] left-[-150px] w-[550px] h-[550px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="absolute bottom-[-150px] right-[-150px] w-[550px] h-[550px] bg-fuchsia-600/15 blur-[150px] rounded-full pointer-events-none" />

      {/* Additional Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">

        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">

          {/* =========================================================
              LEFT BRAND SECTION
          ========================================================= */}
          <div className="hidden lg:block animate-fadeIn">

            {/* Brand Logo */}
            <div className="mb-7">
              <Link
                to="/"
                className="inline-flex items-center group"
              >
                <img
                  src={nexcartLogo}
                  alt="NexCart"
                  className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </Link>
            </div>

            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-sm mb-6">
              <Sparkles size={15} />
              NexCart Security
            </div>

            {/* Heading */}
            <h1 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight">
              Don't worry.
              <br />

              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                We've got you.
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg mt-6">
              Forgot your password? Enter your registered email
              and we'll send you a secure link to create a new one.
            </p>

            {/* Security Features */}
            <div className="mt-10 space-y-4 max-w-lg">

              {/* Secure Reset */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 hover:bg-white/[0.06] transition">

                <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Lock
                    size={21}
                    className="text-purple-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Secure Reset
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Reset your password through a secure email link.
                  </p>
                </div>

              </div>

              {/* Account Protection */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 hover:bg-white/[0.06] transition">

                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck
                    size={21}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Account Protection
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Your account remains protected during the reset.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* =========================================================
              RESET CARD
          ========================================================= */}
          <div className="w-full max-w-md mx-auto animate-scaleIn">

            <div className="rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-2xl shadow-purple-950/30 overflow-hidden">

              {/* Header */}
              <div className="p-7 sm:p-9 pb-5">

                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center mb-7">
                  <Link
                    to="/"
                    className="inline-flex items-center group"
                  >
                    <img
                      src={nexcartLogo}
                      alt="NexCart"
                      className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </Link>
                </div>

                {!sent ? (
                  <>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mb-5">
                      <KeyRound
                        size={22}
                        className="text-purple-400"
                      />
                    </div>

                    <h2 className="text-3xl font-black">
                      Forgot Password?
                    </h2>

                    <p className="text-gray-400 mt-2">
                      Enter your email and we'll send you a
                      password reset link.
                    </p>
                  </>
                ) : (
                  <>
                    {/* Success Icon */}
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mb-5">
                      <CheckCircle2
                        size={22}
                        className="text-emerald-400"
                      />
                    </div>

                    <h2 className="text-3xl font-black">
                      Check Your Email
                    </h2>

                    <p className="text-gray-400 mt-2">
                      We've sent a password reset link to:
                    </p>
                  </>
                )}

              </div>

              {/* =====================================================
                  FORM
              ===================================================== */}
              {!sent ? (
                <form
                  onSubmit={handleSubmit}
                  className="px-7 sm:px-9 pb-8"
                >

                  {/* Email */}
                  <div className="mb-6">

                    <label className="block text-sm text-gray-400 mb-2">
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                      />

                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-start gap-2 text-xs text-gray-500 mb-6">

                    <ShieldCheck
                      size={15}
                      className="text-emerald-400 shrink-0 mt-0.5"
                    />

                    <span>
                      For your security, the reset link will expire
                      after a limited period.
                    </span>

                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-900/30 transition"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                </form>
              ) : (

                /* =====================================================
                   SUCCESS
                ===================================================== */
                <div className="px-7 sm:px-9 pb-8">

                  <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5 mb-6">

                    <div className="flex items-start gap-3">

                      <Mail
                        size={19}
                        className="text-emerald-400 shrink-0 mt-0.5"
                      />

                      <div>

                        <p className="font-semibold text-emerald-400 break-all">
                          {email}
                        </p>

                        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                          Open the email and follow the link to
                          create your new password.
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Success Actions */}
                  <div className="space-y-3">

                    <Link
                      to="/login"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-bold flex items-center justify-center gap-2 transition"
                    >
                      Back to Login
                      <ArrowRight size={18} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold transition"
                    >
                      Try Another Email
                    </button>

                  </div>

                </div>
              )}

              {/* =====================================================
                  BOTTOM
              ===================================================== */}
              <div className="border-t border-white/10 p-6 text-center">

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                >
                  <ArrowLeft size={15} />
                  Back to Login
                </Link>

              </div>

            </div>

            {/* Home */}
            <div className="text-center mt-6">

              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-300 transition"
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

export default ForgotPassword;