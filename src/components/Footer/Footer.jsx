import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 MyStore. All Rights Reserved.</p>
      <p>Follow us on social media</p>
      <div className="social-links">
        <a href="#" className="social-link">Facebook</a>
        <a href="#" className="social-link">Instagram</a>
        <a href="#" className="social-link">Twitter</a>
      </div>
    </footer>
  );
}

export default Footer;
