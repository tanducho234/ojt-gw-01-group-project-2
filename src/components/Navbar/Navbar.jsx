import React, { useState } from "react";
import "./Navbar.css";
import link from 'react-dom';
import AboutUs from "../../pages/About/About";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="shop-header">
      {/* Logo */}
      <button className="shop-header__mobile-btn" onClick={toggleMobileMenu}>
        ☰
      </button>
      <a href="/" className="shop-header__logo">
        SHOP.CO
      </a>

      {/* Navigation */}
      <nav className="shop-header__nav">
        <ul
          className={`shop-header__nav-items ${
            isMobileMenuOpen ? "active" : ""
          }`}
        >
          <li className="shop-header__dropdown">
            <a href="#" className="shop-header__nav-link">
              Shop
            </a>
            <div className="shop-header__dropdown-content">
              
              
              
              <a href="/products" className="shop-header__dropdown-link">
                All Products
              </a>
              <a href="/about" className="shop-header__dropdown-link"></a>
              <a href="#" className="shop-header__dropdown-link">
                New Arrivals
              </a>
              <a href="#" className="shop-header__dropdown-link">
                Best Sellers
              </a>
            </div>
          </li>
          <li>
            <a href="#" className="shop-header__nav-link">
              On Sale
            </a>
          </li>
          <li>
            <a href="#" className="shop-header__nav-link">
              New Arrivals
            </a>
          </li>
          <li>
            <a href="#" className="shop-header__nav-link">
              Brands
            </a>
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
          <img src="../../assets/images/search.png" alt="Visa" />
        </span>
      </div>

      {/* User Actions */}
      <div className="shop-header__actions">
        <a href="/cart" className="shop-header__icon">
          <img src="../../assets/images/stores.png" alt="Visa" />
        </a>
        <a href="/login" className="shop-header__icon">
          <img src="../../assets/images/users.png" alt="Visa" />
        </a>
      </div>
    </header>
  );
};

export default Navbar;
