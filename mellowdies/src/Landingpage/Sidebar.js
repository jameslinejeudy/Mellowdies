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
    position: 'fixed', // puts it all the way at the top
    top: '2%',  // Adjust to add some space from the top
    zIndex: '1001',  // Ensure it stays on top of the menu
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0',
};

function Sidebar() {
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  return (
    <div style={sidebarContainerStyle}>
      <button style={menubuttonStyle} onClick={toggleMenu}>
        <img src={menubutton} alt="Menu Button" style={{  width: '7%'}} />
      </button>
      {isMenuVisible && <Menu />}  {/* Conditionally render the Menu component */}
    </div>
  );
}

export default Sidebar;
