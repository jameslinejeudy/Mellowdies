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
    fontSize: '1.2rem',
    boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',  // Soft, glowy white shadow
    border: 'none',
    position: 'fixed',  // Fix the banner to the top of the screen
    top: '0',  // Position it at the top
    left: '0',  // Ensure it starts from the left edge
    zIndex: '1000',  // Ensure it stays on top of other elements
};


const backbuttonStyle = {
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

const textstyle = {
    color: '#000000',  // Black text color
    fontSize: '2rem',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};



function Menu() {
  return (
    <div style={menubackground}>
        <h1 style={textstyle}> This Is The AI Menu </h1>
    </div>
  );
}

export default Menu;
