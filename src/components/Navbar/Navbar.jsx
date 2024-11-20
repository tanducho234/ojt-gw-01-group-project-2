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
    <header className="shop-header">
      {/* Logo */}
      <button className="shop-header__mobile-btn" onClick={toggleMobileMenu}>
        ☰
      </button>
      <Link to="/" className="shop-header__logo">
        SHOP.CO
      </Link>

      {/* Navigation */}
      <nav className="shop-header__nav">
        <ul
          className={`shop-header__nav-items ${
            isMobileMenuOpen ? "active" : ""
          }`}>
          {/* <Link to="/checkout">abc</Link> */}

          <li className="shop-header__dropdown">
            <Link to="#" className="shop-header__nav-link">
              Shop
            </Link>
            <div className="shop-header__dropdown-content">
              <Link to="/products" className="shop-header__dropdown-link">
                All Products
              </Link>
              <Link to="/about" className="shop-header__dropdown-link">
                About Us
              </Link>
              <Link to="#" className="shop-header__dropdown-link">
                New Arrivals
              </Link>
              <Link to="#" className="shop-header__dropdown-link">
                Best Sellers
              </Link>
            </div>
          </li>
          <li>
            <Link to="#" className="shop-header__nav-link">
              On Sale
            </Link>
          </li>
          <li>
            <Link to="#" className="shop-header__nav-link">
              New Arrivals
            </Link>
          </li>
          <li>
            <Link to="#" className="shop-header__nav-link">
              Brands
            </Link>
          </li>
        </ul>
      </nav>

      {/* Search Bar */}
      <div className="shop-header__search">
        <input
          type="text"
          className="shop-header__search-input"
          placeholder="Search for products..."
        />
        <span className="shop-header__search-icon">
          <img src="../../assets/images/search.png" alt="Search Icon" />
        </span>
      </div>

      {/* User Actions */}
      <div className="shop-header__actions">
        <Link to="/cart" className="shop-header__icon">
          <img src="../../assets/images/stores.png" alt="Cart" />
        </Link>
        <Link to="/login" className="shop-header__icon">
          <img src="../../assets/images/users.png" alt="Login" />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
