import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import useLocation from react-router-dom
import {
  FaCartShopping,
  FaCircleUser,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/assets/images/Logofast.png"
            alt="Shop Logo"
            className="h-15 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                to="/products?sort=createAt&order=desc"
                className="text-gray-600 hover:text-black transition"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                to="/products?sort=salePercentage&order=desc"
                className="text-gray-600 hover:text-black transition"
              >
                On Sale
              </Link>
            </li>

            <li>
              <Link
                to="about"
                className="text-gray-600 hover:text-black transition"
              >
                About Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-40 max-w-lg relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-2 border-none rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-0 focus:shadow-none"
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
          <Link to="/cart" className="relative">
            {/* <img
              src="../../assets/images/stores.png"
              alt="Cart"
              className="w-8 h-8"
            /> */}
            <FaCartShopping size={25} />
            {/* <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              10
            </span> */}
          </Link>
          {/* <Link to="/login">
            <img
              src="../../assets/images/users.png"
              alt="User"
              className="w-8 h-8"
            />
          </Link> */}
          {!user && (
            <Link to="/login">
              <FaCircleUser size={25} />
            </Link>
          )}
          {user && <FaCircleUser size={25} />}

          {user && (
            <FaArrowRightFromBracket
              size={25}
              onClick={handleLogout}
              className="cursor-pointer"
            />
          )}

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
              <Link
                to="#"
                className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/products?sort=salePercentage&order=desc"
                className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
              >
                On Sale
              </Link>
            </li>
            <li>
              <Link
                to="/products?sort=createAt&order=desc"
                className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                to="about"
                className="block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
