import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { toast } from "react-toastify";

import { auth, db } from "../firebase";
import { useCart } from "../context/CartContext";

import nexcartLogo from "../assets/logo/nexcart-logo.png";
import nexcartIcon from "../assets/logo/nexcart-icon.png";

function Checkout() {
  const navigate = useNavigate();

  // =========================
  // CART
  // =========================
  const {
    cart,
    cartItems,
    totalPrice,
    clearCart,
  } = useCart();

  const products = cartItems || cart || [];

  // =========================
  // STATE
  // =========================
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // =========================
  // FORM
  // =========================
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =========================
  // AUTH LISTENER
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setCheckingAuth(false);

        if (currentUser) {
          setForm((previous) => ({
            ...previous,
            email: currentUser.email || "",
          }));
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================
  // LOGIN CHECK
  // =========================
  useEffect(() => {
    if (!checkingAuth && !user) {
      navigate("/login");
    }
  }, [checkingAuth, user, navigate]);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // PRICE FORMAT
  // =========================
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  // =========================
  // PRICE CALCULATION
  // =========================
  const subtotal = Number(totalPrice || 0);

  const deliveryCharge =
    subtotal >= 999 ? 0 : 79;

  const finalTotal =
    subtotal + deliveryCharge;

  // =========================================================
  // PLACE ORDER
  // =========================================================
  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    // =========================
    // CHECK LOGIN
    // =========================
    if (!user) {
      toast.error(
        "Please login before placing your order."
      );

      navigate("/login");
      return;
    }

    // =========================
    // CHECK CART
    // =========================
    if (products.length === 0) {
      toast.error("Your cart is empty.");

      navigate("/products");
      return;
    }

    // =========================
    // REQUIRED FIELDS
    // =========================
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const hasEmptyField =
      requiredFields.some(
        (field) =>
          !String(form[field] || "").trim()
      );

    if (hasEmptyField) {
      toast.error(
        "Please fill all delivery details."
      );

      return;
    }

    // =========================
    // PHONE VALIDATION
    // =========================
    const phoneNumber =
      form.phone.replace(/\D/g, "");

    if (phoneNumber.length !== 10) {
      toast.error(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }

    // =========================
    // PINCODE VALIDATION
    // =========================
    const pincodeNumber =
      form.pincode.replace(/\D/g, "");

    if (pincodeNumber.length !== 6) {
      toast.error(
        "Please enter a valid 6-digit pincode."
      );

      return;
    }

    try {
      setPlacingOrder(true);

      // =========================
      // DEBUG INFORMATION
      // =========================
      console.log(
        "Logged in user:",
        user
      );

      console.log(
        "Firebase UID:",
        user.uid
      );

      console.log(
        "Firebase Email:",
        user.email
      );

      // =========================
      // ORDER DATA
      // =========================
      const orderData = {
        // IMPORTANT:
        // This must match Firestore security rule
        userId: user.uid,

        // =========================
        // CUSTOMER
        // =========================
        customer: {
          firstName:
            form.firstName.trim(),

          lastName:
            form.lastName.trim(),

          email:
            form.email.trim(),

          phone:
            phoneNumber,

          address:
            form.address.trim(),

          city:
            form.city.trim(),

          state:
            form.state.trim(),

          pincode:
            pincodeNumber,
        },

        // =========================
        // PRODUCTS
        // =========================
        products: products.map(
          (item) => ({
            id: item.id,

            name: item.name,

            price: Number(
              item.price || 0
            ),

            quantity: Number(
              item.quantity || 1
            ),

            image:
              item.image || "",

            category:
              item.category || "",
          })
        ),

        // =========================
        // PRICE
        // =========================
        subtotal:
          Number(subtotal),

        deliveryCharge:
          Number(deliveryCharge),

        totalPrice:
          Number(finalTotal),

        // =========================
        // PAYMENT
        // =========================
        paymentMethod:
          "Cash on Delivery",

        // =========================
        // STATUS
        // =========================
        status:
          "Order Placed",

        // =========================
        // TIMESTAMPS
        // =========================
        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      };

      console.log(
        "Order data:",
        orderData
      );

      // =====================================================
      // CREATE ORDER IN FIRESTORE
      // =====================================================
      const orderRef =
        await addDoc(
          collection(db, "orders"),
          orderData
        );

      console.log(
        "Order created successfully:",
        orderRef.id
      );

      // =====================================================
      // CLEAR CART
      // =====================================================
      clearCart();

      // =====================================================
      // SUCCESS MESSAGE
      // =====================================================
      toast.success(
        "Order placed successfully!"
      );

      // =====================================================
      // ORDER SUCCESS PAGE
      // =====================================================
      navigate(
        "/order-success",
        {
          state: {
            orderId:
              orderRef.id,

            customerName:
              `${form.firstName} ${form.lastName}`,

            totalPrice:
              finalTotal,
          },
        }
      );

    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      // =========================
      // PERMISSION ERROR
      // =========================
      if (
        error.code ===
        "permission-denied"
      ) {
        toast.error(
          "Firebase permission denied. Please check your login and Firestore rules."
        );
      }

      // =========================
      // OTHER ERROR
      // =========================
      else {
        toast.error(
          error.message ||
            "Something went wrong while placing your order."
        );
      }

    } finally {
      setPlacingOrder(false);
    }
  };

  // =========================================================
  // AUTH LOADING
  // =========================================================
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center">

        <div className="text-center">

          <img
            src={nexcartIcon}
            alt="NexCart"
            className="w-12 h-12 object-contain mx-auto mb-5 animate-pulse"
          />

          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-400">
            Loading checkout...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // NO USER
  // =========================================================
  if (!user) {
    return null;
  }

  // =========================================================
  // EMPTY CART
  // =========================================================
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[#070711] text-white flex items-center justify-center px-6 relative overflow-hidden">

        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] bg-fuchsia-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative text-center max-w-md">

          <Link
            to="/"
            className="inline-flex items-center justify-center mb-8 group"
          >
            <img
              src={nexcartLogo}
              alt="NexCart"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>

          <div className="w-24 h-24 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mx-auto mb-6">

            <ShoppingBag
              size={40}
              className="text-purple-400"
            />

          </div>

          <h1 className="text-3xl font-bold mb-3">
            Your cart is empty
          </h1>

          <p className="text-gray-400 mb-7">
            Add some products to your cart
            before proceeding to checkout.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-semibold hover:from-purple-500 hover:to-fuchsia-500 transition shadow-lg shadow-purple-900/20"
          >
            Browse Products
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN CHECKOUT
  // =========================================================
  return (
    <div className="min-h-screen bg-[#070711] text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-0 left-[-150px] w-[500px] h-[500px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute top-[45%] right-[-150px] w-[500px] h-[500px] bg-fuchsia-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* =====================================================
            BRANDING
        ===================================================== */}

        <div className="flex justify-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center group"
          >
            <img
              src={nexcartLogo}
              alt="NexCart"
              className="h-11 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>
        </div>

        {/* =====================================================
            BACK TO CART
        ===================================================== */}

        <button
          onClick={() =>
            navigate("/cart")
          }
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={18} />

          Back to Cart
        </button>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-sm mb-4">

            <Lock size={14} />

            Secure Checkout

          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">

            Complete Your{" "}

            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Order
            </span>

          </h1>

          <p className="text-gray-400 mt-3">
            Enter your delivery details and
            confirm your purchase.
          </p>

        </div>

        {/* =====================================================
            CHECKOUT FORM
        ===================================================== */}

        <form
          onSubmit={handlePlaceOrder}
        >

          <div className="grid lg:grid-cols-[1fr_390px] gap-8">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="space-y-6">

              {/* =================================================
                  DELIVERY DETAILS
              ================================================= */}

              <section className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6 sm:p-8">

                <div className="flex items-center gap-4 mb-7">

                  <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">

                    <MapPin
                      className="text-purple-400"
                      size={21}
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold">
                      Delivery Details
                    </h2>

                    <p className="text-sm text-gray-500">
                      Where should we deliver your order?
                    </p>

                  </div>

                </div>

                {/* NAME */}
                <div className="grid sm:grid-cols-2 gap-4">

                  {/* FIRST NAME */}
                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      First Name
                    </label>

                    <div className="relative">

                      <User
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />

                      <input
                        type="text"
                        name="firstName"
                        value={
                          form.firstName
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Devansh"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                      />

                    </div>

                  </div>

                  {/* LAST NAME */}
                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={
                        form.lastName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Jat"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                    />

                  </div>

                </div>

                {/* EMAIL + PHONE */}
                <div className="grid sm:grid-cols-2 gap-4 mt-4">

                  {/* EMAIL */}
                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        form.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                    />

                  </div>

                  {/* PHONE */}
                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      maxLength={10}
                      placeholder="10 digit mobile number"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                    />

                  </div>

                </div>

                {/* ADDRESS */}
                <div className="mt-4">

                  <label className="block text-sm text-gray-400 mb-2">
                    Full Address
                  </label>

                  <textarea
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    rows="3"
                    placeholder="House / Flat / Street / Area"
                    className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none resize-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                  />

                </div>

                {/* CITY STATE PINCODE */}
                <div className="grid sm:grid-cols-3 gap-4 mt-4">

                  {/* CITY */}
                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={
                        form.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Jaipur"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                    />

                  </div>

                  {/* STATE */}
                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={
                        form.state
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Rajasthan"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                    />

                  </div>

                  {/* PINCODE */}
                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={
                        form.pincode
                      }
                      onChange={
                        handleChange
                      }
                      maxLength={6}
                      placeholder="302001"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition placeholder:text-gray-600"
                    />

                  </div>

                </div>

              </section>

              {/* =================================================
                  PAYMENT
              ================================================= */}

              <section className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6 sm:p-8">

                <div className="flex items-center gap-4 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/20 flex items-center justify-center">

                    <CreditCard
                      className="text-fuchsia-400"
                      size={21}
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold">
                      Payment Method
                    </h2>

                    <p className="text-sm text-gray-500">
                      Choose your preferred payment option.
                    </p>

                  </div>

                </div>

                {/* COD */}
                <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">

                      <Truck
                        size={22}
                        className="text-purple-400"
                      />

                    </div>

                    <div className="flex-1">

                      <h3 className="font-semibold">
                        Cash on Delivery
                      </h3>

                      <p className="text-sm text-gray-400 mt-1">
                        Pay when your order arrives at your doorstep.
                      </p>

                    </div>

                    <div className="w-5 h-5 rounded-full border-4 border-purple-500 bg-transparent" />

                  </div>

                </div>

                {/* SECURITY MESSAGE */}
                <div className="flex gap-3 mt-5 text-sm text-gray-500">

                  <ShieldCheck
                    size={18}
                    className="text-emerald-400 shrink-0"
                  />

                  <p>
                    Your order information is securely processed and protected.
                  </p>

                </div>

              </section>

              {/* =================================================
                  TRUST CARDS
              ================================================= */}

              <div className="grid sm:grid-cols-3 gap-4">

                {/* CARD 1 */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                  <ShieldCheck
                    size={22}
                    className="text-emerald-400 mb-3"
                  />

                  <h3 className="font-semibold text-sm">
                    Secure Checkout
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Your data is protected.
                  </p>

                </div>

                {/* CARD 2 */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                  <Truck
                    size={22}
                    className="text-purple-400 mb-3"
                  />

                  <h3 className="font-semibold text-sm">
                    Fast Delivery
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Quick doorstep delivery.
                  </p>

                </div>

                {/* CARD 3 */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                  <CheckCircle2
                    size={22}
                    className="text-fuchsia-400 mb-3"
                  />

                  <h3 className="font-semibold text-sm">
                    Easy Tracking
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Track your order anytime.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                RIGHT SIDE - ORDER SUMMARY
            ================================================= */}

            <div className="lg:sticky lg:top-24 h-fit">

              <div className="rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-xl overflow-hidden">

                {/* SUMMARY HEADER */}
                <div className="p-6 border-b border-white/10">

                  <div className="flex items-center justify-between">

                    <div>

                      <h2 className="text-xl font-bold">
                        Order Summary
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {products.length}{" "}
                        {products.length === 1
                          ? "product"
                          : "products"}
                      </p>

                    </div>

                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">

                      <Package
                        size={20}
                        className="text-purple-400"
                      />

                    </div>

                  </div>

                </div>

                {/* PRODUCTS */}
                <div className="p-6 space-y-4 max-h-[430px] overflow-y-auto">

                  {products.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex gap-4"
                      >

                        {/* IMAGE */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/30 border border-white/10 shrink-0">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />

                        </div>

                        {/* DETAILS */}
                        <div className="flex-1 min-w-0">

                          <h3 className="font-medium text-sm line-clamp-2">
                            {item.name}
                          </h3>

                          <div className="flex items-center justify-between mt-2">

                            <span className="text-xs text-gray-500">
                              Qty:{" "}
                              {item.quantity}
                            </span>

                            <span className="text-sm font-semibold">
                              ₹
                              {formatPrice(
                                Number(
                                  item.price ||
                                    0
                                ) *
                                  Number(
                                    item.quantity ||
                                      1
                                  )
                              )}
                            </span>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

                {/* PRICE */}
                <div className="border-t border-white/10 p-6">

                  <div className="space-y-4">

                    {/* SUBTOTAL */}
                    <div className="flex justify-between text-gray-400">

                      <span>
                        Subtotal
                      </span>

                      <span className="text-white">
                        ₹
                        {formatPrice(
                          subtotal
                        )}
                      </span>

                    </div>

                    {/* DELIVERY */}
                    <div className="flex justify-between text-gray-400">

                      <span>
                        Delivery
                      </span>

                      <span
                        className={
                          deliveryCharge ===
                          0
                            ? "text-emerald-400"
                            : "text-white"
                        }
                      >
                        {deliveryCharge ===
                        0
                          ? "FREE"
                          : `₹${formatPrice(
                              deliveryCharge
                            )}`}
                      </span>

                    </div>

                    {/* FREE DELIVERY */}
                    {deliveryCharge ===
                      0 && (
                      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 text-xs text-emerald-400">
                        🎉 You unlocked free delivery!
                      </div>
                    )}

                    {/* TOTAL */}
                    <div className="border-t border-white/10 pt-4 flex justify-between items-end">

                      <div>

                        <span className="text-gray-400 text-sm">
                          Total
                        </span>

                        <p className="text-xs text-gray-600 mt-1">
                          Inclusive of applicable charges
                        </p>

                      </div>

                      <span className="text-2xl font-black">
                        ₹
                        {formatPrice(
                          finalTotal
                        )}
                      </span>

                    </div>

                  </div>

                  {/* PLACE ORDER BUTTON */}
                  <button
                    type="submit"
                    disabled={
                      placingOrder
                    }
                    className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-900/30 transition"
                  >

                    {placingOrder ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order

                        <ArrowRight
                          size={19}
                        />
                      </>
                    )}

                  </button>

                  {/* SECURITY */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">

                    <Lock
                      size={13}
                    />

                    Secure & encrypted checkout

                  </div>

                </div>

              </div>

              {/* =================================================
                  FREE DELIVERY MESSAGE
              ================================================= */}

              {subtotal < 999 && (
                <div className="mt-4 rounded-2xl border border-purple-400/10 bg-purple-500/5 p-4 text-center">

                  <p className="text-sm text-gray-400">

                    Add{" "}

                    <span className="text-purple-400 font-semibold">
                      ₹
                      {formatPrice(
                        999 - subtotal
                      )}
                    </span>{" "}

                    more to unlock{" "}

                    <span className="text-white font-semibold">
                      FREE delivery
                    </span>

                  </p>

                </div>
              )}

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Checkout;