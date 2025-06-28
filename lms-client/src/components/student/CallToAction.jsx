import React from 'react';
import { assets } from '../../assets/assets';
import './CallToAction.css'; // Link to the CSS file

const CallToAction = () => {
  return (
    <div className="cta-container">
      <h1 className="cta-heading">Learn anything, anytime, anywhere</h1>
      <p className="cta-description">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        A minima nostrum assumenda dicta fugit obcaecati sapiente saepe pariatur 
        facere temporibus!
      </p>
      <div className="cta-buttons">
        <button className="cta-get-started">Get Started</button>
        <button className="cta-learn-more">
          Learn More <img src={assets.arrow_icon} alt="arrow icon" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
