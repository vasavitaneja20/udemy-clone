import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';
import Footer from '../../components/student/Footer';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import './CourseList.css';

const CourseList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="course-list-container">
        <div className="course-list-header">
          <div>
            <h1 className="course-list-title">Course List</h1>
            <p className="course-list-breadcrumb">
              <span className="breadcrumb-home" onClick={() => navigate('/')}>
                Home
              </span>{' '}
              / <span>Course List</span>
            </p>
          </div>

          <SearchBar data={input} />
        </div>

        {input && (
          <div className="search-tag-container">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt="clear"
              onClick={() => navigate('/course-list')}
            />
          </div>
        )}

        <div className="course-grid">
          {filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CourseList;
