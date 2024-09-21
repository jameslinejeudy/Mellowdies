import React from 'react';
import menubutton from '../images/menubutton.png';

const menubackground = {
    width: '25%',
    height: '100%',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    border: '2px solid #ffffff',  // Sharp white border
    backgroundColor: '#ffffff',  // Slightly transparent white background
    fontFamily: "'Concert One', cursive",  // Apply Concert One font
    textAlign: 'left',
    fontSize: '1.2rem',
    boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',  // Soft, glowy white shadow
    border: 'none',
    position: 'fixed',  // Fix the banner to the top of the screen
    top: '0',  // Position it at the top
    left: '0',  // Ensure it starts from the left edge
    zIndex: '1000',  // Ensure it stays on top of other elements
};

const textstyle = {
    color: '#000000',  // Black text color
    fontSize: '2rem',
    marginBottom: '10px',  // Space below the heading
    marginTop: '0',  // Space above the heading
    textAlign: 'left',
};

const buttonStyle = {
    background: 'none',  // Remove default button background
    border: 'none',  // Remove default button border
    padding: '0',  // Remove default button padding
    cursor: 'pointer',  // Ensure cursor changes to pointer on hover
};

function Menu() {
  return (
    <div style={menubackground}>
    </div>
  );
}

export default Menu;
