import React from 'react';
import { assets } from '../../assets/assets';
import './Footer.css'; // Link to CSS file

const Footer = () => {
  return (
    <div>
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-column">
            <img src={assets.logo_dark} alt="logo" />
            <p className="footer-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloremque ratione labore tempore quaerat quidem tenetur 
              magnam corrupti fuga quia nulla!
            </p>
          </div>

          <div className="footer-column">
            <h2 className="footer-heading">Company</h2>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-column footer-subscribe">
            <h2 className="footer-heading">Subscribe to our Newsletter</h2>
            <p className="footer-subtext">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <div className="footer-subscribe-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer-input"
              />
              <button className="footer-button">Subscribe</button>
            </div>
          </div>
        </div>
        <p className="footer-copyright">
          Copyright 2025 © Edemy. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
