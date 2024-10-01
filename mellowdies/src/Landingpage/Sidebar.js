import React, { useState } from 'react';
import menubutton from '../images/menubutton.png';
import sparkless from '../images/drawstar.png';
import Menu from './Menu';
import AIMenu from './Ai';

const sidebarContainerStyle = {
    width: '25%',
    height: '100%',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center', 
    flexDirection: 'column',  // Ensure items stack vertically
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
    paddingTop: '5%',  // Add padding to move the buttons down a bit

}

const buttonStyle = {
    padding: '8px 16px',  // Reduced padding for a more standard button size
    borderRadius: '30px',  // Slightly less rounded corners
    border: '2px solid #ffffff',  // Sharp white border
    backgroundColor: 'rgba(255, 255, 255, 0.5)',  // Slightly transparent white background
    color: '#000',  // Black text color
    fontFamily: "'Concert One', cursive",  // Apply Concert One font
    cursor: 'pointer',
    width: '90%',  // Make the button take up most of the sidebar's width
    marginBottom: '10px',  // Space between buttons
    textAlign: 'center',
    fontSize: '1rem',  // Slightly smaller font size
    boxShadow: '2px 2px 4px white, -2px -2px 4px white',  // Slightly smaller shadow effect
    alignSelf: 'center',  // Centers the button horizontally within the sidebar
    flexDirection: 'row',  // Ensure items stack vertically

};

const menubuttonStyle = {
    display: 'flex',
    flexDirection: 'row',  
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed', // puts it all the way at the top
    top: '1%',  // Adjust to add some space from the top
    left: '0.5%',
    zIndex: '1001',  // Ensure it stays on top of the menu
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',  // Slightly transparent white background
    border: 'none',
    padding: '0',
    width: 'auto',
    height: 'auto',
};

const headingStyle = {
  display: 'flex',
  flexDirection: 'row',  
  alignItems: 'center',
  justifyContent: 'center',
    fontSize: '1.5rem',  // Adjust the font size as needed
    color: '#000000',  // Adjust the color as needed
    margin: 0,  // Remove any default margin
    padding: 0,  // Remove any default padding
    fontFamily: 'Concert One',  // Use Concert One font
    marginLeft: '10px',
    marginTop: '-2px',
    height: 'auto',
};

function Sidebar() {
  const [isMenuVisible, setMenuVisible] = useState(null);

  const toggleMenu = (menu) => {
    setMenuVisible(isMenuVisible === menu ? null : menu);
  };

  const handleBack = () => {
    setMenuVisible(null); // Hide the current menu
  };

  return (
    <div style={sidebarContainerStyle}>
      <button style={menubuttonStyle} onClick={() => toggleMenu('mainMenu')}>
        <img src={menubutton} alt="Menu Button" style={{  width: '33px', height: 'auto'}} />
        <h1 style={headingStyle}>MELLOWDIES</h1>
      </button>
      <button style={buttonStyle} onClick={() => toggleMenu('aiSuggestionMenu')}>  {/* edit onClick when integrated */}
        <h1 style={headingStyle}>✨AI Suggestion✨</h1>
      </button>
      <button style={buttonStyle} onClick={() => toggleMenu('mixerMenu')}>  {/* edit onClick when integrated */}
        <h1 style={headingStyle}>Mixer</h1>
      </button>
      {/* Conditionally render different menus based on which one is visible */}
      {isMenuVisible === 'mainMenu' && <Menu handleBack={handleBack} />}
      {isMenuVisible === 'aiSuggestionMenu' && <AIMenu handleBack={handleBack} />}
      {isMenuVisible === 'mixerMenu' && <Menu handleBack={handleBack} />}
    </div>
  );
}

export default Sidebar;
