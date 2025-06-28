import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import './MyCourses.css';

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      setCourses(allCourses);
    }
  }, [allCourses]);

  return courses ? (
    <div className="mycourses-container">
      <div className="mycourses-wrapper">
        <h2 className="mycourses-heading">My Courses</h2>
        <div className="mycourses-table-container">
          <table className="mycourses-table">
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
                  <td className="course-title-cell">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="course-thumbnail"
                    />
                    <span className="course-title-text">{course.courseTitle}</span>
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
