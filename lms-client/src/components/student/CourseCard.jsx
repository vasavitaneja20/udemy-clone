import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css'; // Link to your external CSS
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {
  const { currency } = useContext(AppContext);

  const finalPrice = (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2);

  const {calculateRating} = useContext(AppContext)

  return (
    <Link to={`/course/${course._id}`} onClick={() => scrollTo(0, 0)} className="course-card">
      <img className="course-card-image" src={course.courseThumbnail} alt={course.courseTitle} />
      <div className="course-card-content">
        <h3 className="course-card-title">{course.courseTitle}</h3>
        <p className="course-card-educator">{course.educator.name}</p>

        <div className="course-card-rating">
          <p>{calculateRating(course)}</p>
          <div className="course-card-rating-stars">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt="star" />
            ))}
          </div>
          <p className='course-card-review-count'>{course.courseRatings.length}</p>
          
        </div>

        <p className="course-card-price">
          {currency}
          {finalPrice}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
