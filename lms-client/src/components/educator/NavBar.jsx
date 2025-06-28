import React from 'react';
import './NavBar.css';
import { assets, dummyEducatorData } from '../../assets/assets';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();

  return (
    <div className="navbar">
      <Link to="/">
        <img className="navbar-logo" src={assets.logo} alt="Logo" />
      </Link>

      <div className="navbar-user">
        <p>Hi! {user ? user.fullName : 'Developer'}</p>
        {user ? (
          <UserButton />
        ) : (
          <img className="navbar-profile-img" src={assets.profile_img} alt="Profile" />
        )}
      </div>
    </div>
  );
};

export default NavBar;
