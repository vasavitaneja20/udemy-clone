import React, { useContext } from 'react';
import './SideBar.css';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Students enrolled', path: '/educator/students-enrolled', icon: assets.person_tick_icon },
  ];

  return (
    isEducator && (
      <div className="sidebar-container">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === '/educator'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <img src={item.icon} alt="" className="sidebar-icon" />
            <p className="sidebar-label">{item.name}</p>
          </NavLink>
        ))}
      </div>
    )
  );
};

export default SideBar;
