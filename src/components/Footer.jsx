import React from "react";
import { Link } from "react-router-dom";

import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUpRight,
} from "lucide-react";

import nexcartLogoWhite from "../assets/logo/nexcart-logo-white.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-[#050509] text-white">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-[120px]" />

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* =========================
              BRAND
          ========================== */}
          <div>

            <Link
              to="/"
              onClick={scrollToTop}
              className="group inline-flex items-center"
            >
              <img
                src={nexcartLogoWhite}
                alt="NexCart"
                className="h-12 w-auto object-contain transition duration-300 group-hover:scale-[1.03]"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Your one-stop destination for premium products,
              modern technology and an amazing shopping experience.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex flex-wrap gap-3">

              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                Facebook
              </a>

              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-400"
              >
                Instagram
              </a>

              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-sky-400/30 hover:bg-sky-500/10 hover:text-sky-400"
              >
                Twitter
              </a>

            </div>
          </div>

          {/* =========================
              QUICK LINKS
          ========================== */}
          <div>

            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">

              <li>
                <Link
                  to="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="transition hover:text-white"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="transition hover:text-white"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="transition hover:text-white"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="transition hover:text-white"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="transition hover:text-white"
                >
                  My Profile
                </Link>
              </li>

            </ul>
          </div>

          {/* =========================
              CUSTOMER SERVICE
          ========================== */}
          <div>

            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-white">
              Customer Service
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">

              <li>
                <a
                  href="mailto:support@nexcart.com"
                  className="transition hover:text-white"
                >
                  Contact Us
                </a>
              </li>

              <li>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="transition hover:text-white"
                >
                  Shipping & Delivery
                </a>
              </li>

              <li>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="transition hover:text-white"
                >
                  Returns & Refunds
                </a>
              </li>

              <li>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="transition hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="transition hover:text-white"
                >
                  Terms & Conditions
                </a>
              </li>

            </ul>
          </div>

          {/* =========================
              CONTACT
          ========================== */}
          <div>

            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-white">
              Contact Us
            </h3>

            <div className="space-y-5 text-sm text-slate-400">

              {/* Location */}
              <div className="flex items-start gap-3">

                <MapPin
                  size={19}
                  className="mt-1 flex-shrink-0 text-purple-400"
                />

                <p>
                  Jaipur, Rajasthan
                  <br />
                  India
                </p>

              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">

                <Phone
                  size={19}
                  className="flex-shrink-0 text-purple-400"
                />

                <a
                  href="tel:+919876543210"
                  className="transition hover:text-white"
                >
                  +91 98765 43210
                </a>

              </div>

              {/* Email */}
              <div className="flex items-center gap-3">

                <Mail
                  size={19}
                  className="flex-shrink-0 text-purple-400"
                />

                <a
                  href="mailto:support@nexcart.com"
                  className="transition hover:text-white"
                >
                  support@nexcart.com
                </a>

              </div>

              {/* Website */}
              <div className="flex items-center gap-3">

                <Globe
                  size={19}
                  className="flex-shrink-0 text-purple-400"
                />

                <span>
                  nexcart.com
                </span>

              </div>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Shop CTA */}
        <div className="mb-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-5 sm:flex-row sm:px-6">

          <div>
            <p className="text-sm font-semibold text-white">
              Ready to explore NexCart?
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Discover products made for your everyday life.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:-translate-y-0.5 hover:shadow-purple-900/40"
          >
            Shop Now

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/[0.06]">

        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">

          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">

            <p className="text-center text-xs text-slate-500">
              © {new Date().getFullYear()} NexCart.
              All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              className="text-xs font-medium text-slate-500 transition hover:text-white"
            >
              Back to top ↑
            </button>

            <p className="text-xs text-slate-500">
              Made with ❤️ for better shopping
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;