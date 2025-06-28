import React from 'react';
import { assets } from '../../assets/assets';
import './Companies.css'; // Link your CSS file

const Companies = () => {
  return (
    <div className="companies-container">
      <p className="companies-subtitle">Trusted by learners from</p>
      <div className="companies-logos">
        <img src={assets.microsoft_logo} alt="microsoft" className="company-logo" />
        <img src={assets.walmart_logo} alt="walmart" className="company-logo" />
        <img src={assets.accenture_logo} alt="accenture" className="company-logo" />
        <img src={assets.adobe_logo} alt="adobe" className="company-logo" />
        <img src={assets.paypal_logo} alt="paypal" className="company-logo" />
      </div>
    </div>
  );
};

export default Companies;
