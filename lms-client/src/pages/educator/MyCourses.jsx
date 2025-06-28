import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import './MyCourses.css';

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);

  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    setCourses(allCourses);
  };

  useEffect(() => {
  if (allCourses && allCourses.length > 0) {
    setCourses(allCourses);
  }
}, [allCourses]);


  return courses ? (
    <div className="my-courses-container">
      <div className="my-courses-wrapper">
        <h2 className="my-courses-heading">My Courses</h2>
        <div className="courses-table-container">
          <table className="courses-table">
            <thead>
              <tr>
                <th>All Courses</th>
                <th>Earnings</th>
                <th>Students</th>
                <th>Published On</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="course-info-cell">
                    <img src={course.courseThumbnail} alt="" className="course-thumbnail" />
                    <span className="course-title">{course.courseTitle}</span>
                  </td>
                  <td>
                    {currency}
                    {Math.floor(course.enrolledStudents.length) *
                      (course.coursePrice - (course.discount * course.coursePrice) / 100)}
                  </td>
                  <td>{course.enrolledStudents.length}</td>
                  <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
