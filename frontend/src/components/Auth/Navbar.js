import React, { useState } from 'react';
import '../../componentsCSS/Navbar.css'; // You can create a CSS file for styling

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <span>userManagement</span>
      </div>
      <div className="navbar-right">
        <div className="dropdown" onBlur={closeDropdown}>
          <button onClick={toggleDropdown} className="dropbtn">
            <img src="path/to/your/image.png" alt="User" className="user-img" />
          </button>
          {showDropdown && (
            <div className="dropdown-content">
              {/* Dropdown content goes here */}
              <a href="#">Profile</a>
              <a href="#">Settings</a>
              <a href="#">Logout</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
