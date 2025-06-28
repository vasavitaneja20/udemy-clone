import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './CourseSection.css'; // Import CSS file
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

const CourseSection = () => {
  
  const {allCourses} = useContext(AppContext)

  return (
    <div className="course-section">
      <h2 className="course-title">Learn from the best</h2>
      <p className="course-description">
        Discover our top-rated courses across various categories. <br />From coding and design, to business
        and wellness, our courses are crafted to deliver results.
      </p>

      <div className="course-grid">
        {allCourses.slice(0,4).map((course, index)=><CourseCard key={index} 
        course = {course} />)} {/* display only 4 courses */}
      </div>
      <Link
        to="/course-list"
        onClick={() => scrollTo(0, 0)}
        className="course-button"
      >
        Show all courses
      </Link>
    </div>
  );
};

export default CourseSection;
