import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <img className="footer-logo" src={assets.logo} alt="logo" />
        <div className="footer-divider"></div>
        <p className="footer-text">
          Copyright 2025 © Edemy. All Rights Reserved.
        </p>
      </div>

      <div className="footer-socials">
        <a href="#"><img src={assets.facebook_icon} alt="facebook" /></a>
        <a href="#"><img src={assets.twitter_icon} alt="twitter" /></a>
        <a href="#"><img src={assets.instagram_icon} alt="instagram" /></a>
      </div>
    </footer>
  );
};

export default Footer;
