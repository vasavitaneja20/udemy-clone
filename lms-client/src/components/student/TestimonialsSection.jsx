import React from 'react';
import { dummyTestimonial, assets } from '../../assets/assets';
import './TestimonialsSection.css'; // Import the CSS file

const TestimonialsSection = () => {
  return (
    <div className="testimonials-section">
      <h2 className="testimonials-title">Testimonials</h2>
      <p className="testimonials-subtitle">
        Hear from our learners as they share their journeys of transformation, success, and how our <br />
        platform has made a difference in their lives.
      </p>

      <div className="testimonials-list">
        {dummyTestimonial.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <div className="testimonial-header">
              <img
                className="testimonial-avatar"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h3 className="testimonial-name">{testimonial.name}</h3>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
            </div>

            <div className="testimonial-body">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="star-icon"
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                  />
                ))}
              </div>
              <p className="testimonial-feedback">{testimonial.feedback}</p>
            </div>
            <a href="#" className='read-more-link'>Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
