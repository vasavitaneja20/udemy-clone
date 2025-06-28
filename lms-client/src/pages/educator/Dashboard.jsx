import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { currency } = useContext(AppContext);

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  console.log('hello');
  
  return dashboardData ? (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <img src={assets.appointments_icon} alt="" />
            <div>
              <p className="card-number">{dashboardData.totalCourses}</p>
              <p className="card-label">Total Courses</p>
            </div>
          </div>

          <div className="dashboard-card">
            <img src={assets.earning_icon} alt="" />
            <div>
              <p className="card-number">{currency}{dashboardData.totalEarnings}</p>
              <p className="card-label">Total Earnings</p>
            </div>
          </div>

          <div className="dashboard-card">
            <img src={assets.patients_icon} alt="" />
            <div>
              <p className="card-number">{dashboardData.enrolledStudentsData.length}</p>
              <p className="card-label">Total Enrollments</p>
            </div>
          </div>
        </div>

        <div className="dashboard-enrollments">
          <h2 className="enrollment-title">Latest Enrollments</h2>
          <div className="enrollment-table-wrapper">
            <table className="enrollment-table">
              <thead>
                <tr>
                  <th className="hide-on-sm text-center">#</th>
                  <th>Student Name</th>
                  <th>Course Title</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index}>
                    <td className="hide-on-sm text-center">{index + 1}</td>
                    <td className="student-cell">
                      <img
                        src={item.student.imageUrl}
                        alt="profile"
                        className="student-image"
                      />
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="truncate">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
