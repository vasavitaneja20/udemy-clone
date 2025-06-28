import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';
import './MyEnrollments.css';

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } = useContext(AppContext);

  const [progressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 }
  ]);

  return (
    <>
      <div className="enrollments-container">
        <h1 className="enrollments-heading">My Enrollments</h1>
        <table className="enrollments-table">
          <thead className="enrollments-thead">
            <tr>
              <th className="enrollments-th">Course</th>
              <th className="enrollments-th">Duration</th>
              <th className="enrollments-th">Completed</th>
              <th className="enrollments-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course, index) => (
              <tr className="enrollments-tr" key={index}>
                <td className="enrollments-td">
                  <div className="enrollments-course">
                    <img src={course.courseThumbnail} alt="" className="enrollments-image" />
                    <div className="enrollments-details">
                      <p className="enrollments-course-title">{course.courseTitle}</p>
                      <Line
                        strokeWidth={2}
                        percent={
                          progressArray[index]
                            ? (progressArray[index].lectureCompleted * 100) /
                              progressArray[index].totalLectures
                            : 0
                        }
                        trailColor="#d1d5db"
                        strokeColor="#3b82f6"
                      />
                    </div>
                  </div>
                </td>

                <td className="enrollments-td">{calculateCourseDuration(course)}</td>

                <td className="enrollments-td">
                  {progressArray[index] &&
                    `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures} Lectures`}
                </td>

                <td className="enrollments-td">
                  <button
                    className="enrollments-button"
                    onClick={() => navigate('/player/' + course._id)}
                  >
                    {progressArray[index] &&
                    progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1
                      ? 'Completed'
                      : 'Ongoing'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
