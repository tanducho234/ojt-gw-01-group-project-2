import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800">
      {/* Newsletter Section */}
      <div
        className="flex justify-center items-center py-6 md:py-10 px-4 h-64"
        style={{
          background: "linear-gradient(to bottom, #FFFFFF 50%, #F0F0F0 50%)",
        }}>
        <div className="bg-black text-white py-6 md:py-10 px-4 md:px-7 rounded-2xl w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between">
          <h2 className="text-xl md:text-2xl lg:text-5xl font-bold max-w-2xl text-center md:text-left mb-4 md:mb-0">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>
          <form className="flex flex-col items-center md:items-start gap-4 mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                    stroke="#6C7275"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full pl-14 pr-4 py-3 rounded-full text-black border border-gray-300 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-72 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition">
              Subscribe to Newsletter
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="text-xl font-bold text-black">
              <img
                src="/assets/images/Logofast.png"
                alt="Shop Logo"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600">
              We have clothes that suit your style and <br></br> which you're proud to
              wear. From <br></br>women to men.
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              {/* Social Media Icons */}
              <Link
                to="#"
                className="w-8 md:w-10 h-8 md:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition">
                <svg
                  className="w-4 md:w-5 h-4 md:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Link>
              <Link
                to="#"
                className="w-8 md:w-10 h-8 md:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition">
                <svg
                  className="w-4 md:w-5 h-4 md:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </Link>
              <Link
                to="#"
                className="w-8 md:w-10 h-8 md:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition">
                <svg
                  className="w-4 md:w-5 h-4 md:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link
                to="#"
                className="w-8 md:w-10 h-8 md:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 transition">
                <svg
                  className="w-4 md:w-5 h-4 md:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Footer Links Sections */}
          <div className="space-y-4">
            <h4 className="font-bold text-base md:text-lg">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/About"
                  className="text-sm text-gray-600 hover:text-black transition">
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Works
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Career
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-base md:text-lg">HELP</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/coming-soon"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Delivery Details
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-base md:text-lg">FAQ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Account
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Manage Deliveries
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-gray-600 hover:text-black transition">
                  Payments
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300 py-5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <span className="text-sm text-gray-600">
            Lashes © 2024, All Rights Reserved
          </span>
          <div className="flex items-center gap-4">
            <img src="/assets/images/Visa.png" alt="Visa" className="h-10" />
            <img src="/assets/images/Badge.png" alt="Badge" className="h-10" />
            <img
              src="/assets/images/GooglePay.png"
              alt="Google Pay"
              className="h-10"
            />
            <img src="/assets/images/Pay.png" alt="VNPay" className="h-10" />
            <img src="/assets/images/VNPAY.png" alt="VNPay" className="h-10" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
