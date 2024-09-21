import React, { useState } from 'react';
import menubutton from '../images/menubutton.png';
import Menu from './Menu';

const sidebarContainerStyle = {
    width: '25%',
    height: '100%',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    border: '2px solid #ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',  // Slightly transparent white background
    fontFamily: "'Concert One', cursive",
    textAlign: 'left',
    fontSize: '1.2rem',
    boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '1001',
};

const menubuttonStyle = {
    display: 'flex',
    flexDirection: 'row',  
    position: 'fixed', // puts it all the way at the top
    top: '1%',  // Adjust to add some space from the top
    left: '0.5%',
    zIndex: '1001',  // Ensure it stays on top of the menu
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',  // Slightly transparent white background
    border: 'none',
    padding: '0',
    width: '2%',
};

const headingStyle = {
    fontSize: '1.5rem',  // Adjust the font size as needed
    color: '#000000',  // Adjust the color as needed
    margin: 0,  // Remove any default margin
    padding: 0,  // Remove any default padding
    fontFamily: 'Concert One',  // Use Concert One font
    marginLeft: '10px',

};

function Sidebar() {
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  return (
    <div style={sidebarContainerStyle}>
      <button style={menubuttonStyle} onClick={toggleMenu}>
        <img src={menubutton} alt="Menu Button" style={{  width: '100%'}} />
        <h1 style={headingStyle}>Mellowdies</h1>

      </button>

      {isMenuVisible && <Menu />}  {/* Conditionally render the Menu component */}
    </div>
  );
}

export default Sidebar;
