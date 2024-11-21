import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  const location = useLocation(); // Get the current location
  // Check if the current path is '/admin' to hide the Navbar
  if (location.pathname.startsWith("/admin")) {
    return null; // Don't render the Navbar when the route starts with /admin
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <img
            src="/public/assets/images/Logofast.png"
            alt="Shop Logo"
            className="h-8 w-auto"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <ul className="flex items-center space-x-6">
            <li className="relative group">
              <a href="#" className="text-gray-600 hover:text-black transition">
                Shop
              </a>
              {/* Dropdown Menu */}
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg py-2 z-10 top-full left-0 w-48">
                <a
                  href="/products"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  All Products
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  New Arrivals
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Best Sellers
                </a>
              </div>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-black transition">
                On Sale
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-black transition">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-black transition">
                Brands
              </a>
            </li>
          </ul>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8 max-w-lg relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-2 border-none rounded-full bg-gray-100 text-sm focus:outline-none"

            placeholder="Search for products..."
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
            <img
              src="../../assets/images/search.png"
              alt="Search"
              className="w-5 h-5"
            />
          </span>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <a href="/cart" className="relative">
            <img
              src="../../assets/images/stores.png"
              alt="Cart"
              className="w-8 h-8"
            />
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              10
            </span>
          </a>
          <a href="/login">
            <img
              src="../../assets/images/users.png"
              alt="User"
              className="w-8 h-8"
            />
          </a>
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-600 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md">
          <ul className="px-4 py-2 space-y-2">
            <li>
              <a
                href="#"
                className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
              >
                On Sale
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
              >
                New Arrivals
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
              >
                Brands
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
