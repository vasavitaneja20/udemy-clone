import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import './NavBar.css'; // Import the custom CSS
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';

const NavBar = () => {

  const isCourseListPage = location.pathname.includes('/course-list');

  const {openSignIn} = useClerk()
  const {user} = useUser()

  const {navigate, isEducator} = useContext(AppContext)

  return (
    <div className={`navbar ${isCourseListPage ? 'white-bg' : 'cyan-bg'}`}>
      <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className="navbar-logo" />

      <div className="navbar-links">
        <div className="navbar-buttons">
            {user && <>
                <button onClick={()=> {navigate('/educator')}} className="text-button">{isEducator? 'Educator Dashboard' : 'Become Educator'}</button>
          <span className="divider">|</span>
          <Link to="/my-enrollments" className="link-button">My Enrollments</Link>
            </>}
          
        </div>
        { user ? <UserButton/> :
            <button onClick={()=>{openSignIn()}} className="cta-button">Create Account</button>}
      </div>

{/* For phone screen */}
<div className="mobile-navbar">
  <div className="navbar-buttons">
  {user && <>
                <button className="text-button">Become Educator</button>
          <span className="divider">|</span>
          <Link to="/my-enrollments" className="link-button">My Enrollments</Link>
            </>}
  </div>
  {user ? <UserButton /> :
   <button onClick={()=>{
    openSignIn()
   }} className="icon-button">
   <img src={assets.user_icon} alt="User" />
 </button>
  }
 
</div>

    </div>
  );
};

export default NavBar;
