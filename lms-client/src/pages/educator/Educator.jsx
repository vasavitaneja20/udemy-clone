import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../components/educator/NavBar';
import SideBar from '../../components/educator/SideBar';
import Footer from '../../components/educator/Footer';
import './educator.css'; // Ensure this is imported

const Educator = () => {
  return (
    <div className="educator-wrapper">
      <NavBar />
      
      <div className="main-layout">
        <SideBar />
        <div className="outlet">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Educator;
