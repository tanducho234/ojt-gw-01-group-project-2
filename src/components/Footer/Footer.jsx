import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        {/* Newsletter Section */}
        <div className="newsletter">
          <div className="newsletter-content">
            <h2>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
            <form className="newsletter-form" id="newsletter-form">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div className="submit">
                <button type="submit">Subscribe to Newsletter</button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-column">
            <h3>SHOP.CO</h3>
            <p>
              We have clothes that suit your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="social-icons">
              <div className="social-icon"><img src="../../assets/images/bird.png" alt="Visa" /></div>
              <div className="social-icon"><img src="../../assets/images/2.png" alt="Visa" /></div>
              <div className="social-icon"><img src="../../assets/images/ins.png" alt="Visa" /></div>
              <div className="social-icon"><img src="../../assets/images/cat.png" alt="Visa" /></div>
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-links">
            <h4>COMPANY</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Works</a></li>
              <li><a href="#">Career</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div className="footer-links">
            <h4>HELP</h4>
            <ul>
              <li><a href="#">Customer Support</a></li>
              <li><a href="#">Delivery Details</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* FAQ Links */}
          <div className="footer-links">
            <h4>FAQ</h4>
            <ul>
              <li><a href="#">Account</a></li>
              <li><a href="#">Manage Deliveries</a></li>
              <li><a href="#">Orders</a></li>
              <li><a href="#">Payments</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="footer-links">
            <h4>RESOURCES</h4>
            <ul>
              <li><a href="#">Free eBooks</a></li>
              <li><a href="#">Development Tutorial</a></li>
              <li><a href="#">How to - Blog</a></li>
              <li><a href="#">YouTube Playlist</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright">
            Shop.co © 2000-2023. All Rights Reserved
          </div>
          <div className="payment-methods">
            <img src="../../assets/images/Visa.png" alt="Visa" />
            <img src="../../assets/images/Badge.png" alt="Mastercard" />
            <img src="../../assets/images/PayPal.png" alt="PayPal" />
            <img src="../../assets/images/Pay.png" alt="Apple Pay" />
            <img src="../../assets/images/GooglePay.png" alt="Google Pay" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
