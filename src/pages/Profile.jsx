import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  KeyRound,
  LogOut,
  Mail,
  Package,
  Save,
  ShoppingBag,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";

import { auth } from "../firebase";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Profile() {
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordSection, setShowPasswordSection] =
    useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          setProfileForm({
            name: currentUser.displayName || "",
          });
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    if (!user) return;

    const name = profileForm.name.trim();

    if (!name) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setSavingProfile(true);

      await updateProfile(user, {
        displayName: name,
      });

      setUser(auth.currentUser);

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error.message || "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();

    if (!user) return;

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from the current password."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(user, newPassword);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordSection(false);

      toast.success("Password updated successfully.");
    } catch (error) {
      console.error("Password update error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Current password is incorrect.");
      } else if (
        error.code === "auth/requires-recent-login"
      ) {
        toast.error(
          "Please login again before changing your password."
        );
      } else {
        toast.error(
          error.message || "Unable to update password."
        );
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await signOut(auth);

      toast.success("Logged out successfully.");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      toast.error("Unable to logout.");
    } finally {
      setLoggingOut(false);
    }
  };

  const getInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#070711] text-white relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 left-[-150px] w-[500px] h-[500px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute top-[45%] right-[-150px] w-[500px] h-[500px] bg-fuchsia-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-sm mb-4">
            <User size={15} />
            Account Center
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            My{" "}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>

          <p className="text-gray-400 mt-3">
            Manage your account, security and NexCart activity.
          </p>
        </div>

        {/* Profile Hero */}
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-xl overflow-hidden mb-8">

          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

          <div className="relative p-6 sm:p-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">

              <div className="flex items-center gap-5">

                {/* Avatar */}
                <div className="relative">

                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 p-[2px] shadow-xl shadow-purple-900/30">

                    <div className="w-full h-full rounded-[14px] bg-[#0c0c18] flex items-center justify-center">

                      <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        {getInitial()}
                      </span>

                    </div>
                  </div>

                  <div className="absolute -right-2 -bottom-2 w-7 h-7 rounded-full bg-emerald-500 border-4 border-[#0c0c18] flex items-center justify-center">
                    <CheckCircle2
                      size={14}
                      className="text-white"
                    />
                  </div>

                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    {user.displayName || "NexCart User"}
                  </h2>

                  <p className="text-gray-400 mt-1">
                    {user.email}
                  </p>

                  <div className="inline-flex items-center gap-2 mt-3 text-xs text-emerald-400">
                    <ShieldCheck size={14} />
                    Verified account
                  </div>
                </div>

              </div>

              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <Package size={17} />
                My Orders
                <ArrowRight size={16} />
              </Link>

            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          <Link
            to="/orders"
            className="group rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 hover:border-purple-400/30 transition"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Orders
                </p>

                <p className="text-2xl font-black mt-1">
                  View
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                <Package
                  size={20}
                  className="text-purple-400"
                />
              </div>

            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 mt-4 group-hover:text-purple-400 transition">
              View order history
              <ArrowRight size={13} />
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="group rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 hover:border-pink-400/30 transition"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Wishlist
                </p>

                <p className="text-2xl font-black mt-1">
                  {wishlistCount}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-400/20 flex items-center justify-center">
                <Heart
                  size={20}
                  className="text-pink-400"
                />
              </div>

            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 mt-4 group-hover:text-pink-400 transition">
              View wishlist
              <ArrowRight size={13} />
            </div>
          </Link>

          <Link
            to="/cart"
            className="group rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5 hover:border-fuchsia-400/30 transition"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Cart Items
                </p>

                <p className="text-2xl font-black mt-1">
                  {cartCount}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/20 flex items-center justify-center">
                <ShoppingBag
                  size={20}
                  className="text-fuchsia-400"
                />
              </div>

            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 mt-4 group-hover:text-fuchsia-400 transition">
              Open cart
              <ArrowRight size={13} />
            </div>
          </Link>

        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">

          {/* Account Information */}
          <div className="space-y-8">

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden">

              <div className="p-6 sm:p-8 border-b border-white/10">

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                    <User
                      size={21}
                      className="text-purple-400"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Personal Information
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Update your account details.
                    </p>
                  </div>

                </div>

              </div>

              <form
                onSubmit={handleProfileUpdate}
                className="p-6 sm:p-8"
              >

                <div className="mb-5">

                  <label className="block text-sm text-gray-400 mb-2">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      placeholder="Your name"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                    />

                  </div>
                </div>

                <div className="mb-6">

                  <label className="block text-sm text-gray-400 mb-2">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/10 border border-white/10 text-gray-500 cursor-not-allowed"
                    />

                  </div>

                  <p className="text-xs text-gray-600 mt-2">
                    Your login email cannot be changed here.
                  </p>

                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition shadow-lg shadow-purple-900/20"
                >
                  {savingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>

              </form>
            </section>

            {/* Password */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden">

              <div className="p-6 sm:p-8">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/20 flex items-center justify-center">
                      <KeyRound
                        size={21}
                        className="text-fuchsia-400"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">
                        Account Security
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Manage your password.
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswordSection(
                        (previous) => !previous
                      )
                    }
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    {showPasswordSection ? (
                      <X size={18} />
                    ) : (
                      <KeyRound size={18} />
                    )}
                  </button>

                </div>

                {showPasswordSection && (
                  <form
                    onSubmit={handlePasswordUpdate}
                    className="mt-7 pt-7 border-t border-white/10 space-y-4"
                  >

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Current Password
                      </label>

                      <input
                        type="password"
                        name="currentPassword"
                        value={
                          passwordForm.currentPassword
                        }
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/10 transition placeholder:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        New Password
                      </label>

                      <input
                        type="password"
                        name="newPassword"
                        value={
                          passwordForm.newPassword
                        }
                        onChange={handlePasswordChange}
                        placeholder="Minimum 6 characters"
                        className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/10 transition placeholder:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Confirm New Password
                      </label>

                      <input
                        type="password"
                        name="confirmPassword"
                        value={
                          passwordForm.confirmPassword
                        }
                        onChange={handlePasswordChange}
                        placeholder="Repeat new password"
                        className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-fuchsia-500/60 focus:ring-2 focus:ring-fuchsia-500/10 transition placeholder:text-gray-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
                    >
                      {changingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <KeyRound size={17} />
                          Update Password
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Account Status */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6">

              <div className="flex items-center gap-3 mb-6">

                <ShieldCheck
                  size={22}
                  className="text-emerald-400"
                />

                <h2 className="text-lg font-bold">
                  Account Status
                </h2>

              </div>

              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-400"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-emerald-400">
                      Account Active
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Your NexCart account is secure.
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6">

              <h2 className="text-lg font-bold mb-5">
                Quick Actions
              </h2>

              <div className="space-y-3">

                <Link
                  to="/orders"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Package
                      size={18}
                      className="text-purple-400"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      My Orders
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Track your purchases
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-gray-600"
                  />
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <Heart
                      size={18}
                      className="text-pink-400"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      Wishlist
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {wishlistCount} saved items
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-gray-600"
                  />
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
                    <ShoppingBag
                      size={18}
                      className="text-fuchsia-400"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      Shopping Cart
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {cartCount} items in cart
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-gray-600"
                  />
                </Link>

              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 disabled:opacity-50 transition font-semibold"
            >
              {loggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut size={18} />
                  Logout
                </>
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;