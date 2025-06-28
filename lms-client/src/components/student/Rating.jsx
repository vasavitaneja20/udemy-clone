import React, { useEffect, useState } from 'react';
import './Rating.css';

const Rating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0);

  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div className="rating-stars">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${starValue <= rating ? 'filled' : ''}`}
            onClick={() => handleRating(starValue)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
