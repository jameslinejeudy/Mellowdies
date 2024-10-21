import React from 'react';
import menubutton from '../images/icons/menubutton.png';

const menubackground = {
  width: '25%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column', // Stack elements vertically
  justifyContent: 'flex-start', // Align items at the top initially
  alignItems: 'left',
  border: '2px solid #ffffff',  // Sharp white border
  backgroundColor: '#ffffff',  // White background
  fontFamily: "'Concert One', cursive",  // Apply Concert One font
  fontSize: '1.2rem',
  boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',  // Soft, glowy white shadow
  border: 'none',
  position: 'fixed',  // Fix the sidebar to the top
  top: '0',  // Position it at the top
  left: '0',  // Ensure it starts from the left edge
  zIndex: '1000',  // Ensure it stays on top of other elements
  paddingTop: '50px', // Add some space from the top
};

const backbuttonStyle = {
  display: 'flex',
  flexDirection: 'row',  
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed', // Fixes the button position
  top: '1%',  // Adjust to add some space from the top
  left: '0.5%',
  zIndex: '1001',  // Ensure it stays on top of the menu
  cursor: 'pointer',
  backgroundColor: 'rgba(255, 255, 255, 0.0)',  // Transparent background
  border: 'none',
  padding: '0',
  width: 'auto',
  height: 'auto',
};

const textstyle = {
  color: '#000000',  // Black text color
  fontSize: '2rem',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '50px',  // Lower the menu header by adding a margin at the top
};

const backButtonStyle = {
marginTop: '10px',
background: '#007bff', // Blue background (Bootstrap primary color)
color: '#fff', // White text color
border: 'none', // Remove default border
padding: '10px 20px', // Add padding to make the button taller and wider
borderRadius: '5px', // Slightly round the corners
cursor: 'pointer', // Change cursor to pointer
fontSize: '16px', // Adjust font size
textAlign: 'center', // Center the text
width: 'auto', // Adjust width to fit the content
display: 'inline-block',
transition: 'background 0.3s ease', // Add a transition effect for hover
};

const contentStyle = {
flexGrow: 1, // Take up remaining space
paddingTop: '60px', // Add padding to push content lower
};


function Menu({ handleBack }) {
  return (
    <div style={menubackground}>
      <div style={contentStyle}>
        <h1 style={textstyle}> This Is The Menu </h1>
        {/* Back button to close the menu */}
        <button style={backButtonStyle} onClick={handleBack}>Back</button>
      </div>
    </div>
  );
}

export default Menu;
