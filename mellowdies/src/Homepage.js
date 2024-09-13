// HomePage.js

import React from 'react';

const pageStyle = {
  backgroundColor: '#F8C8DC',
  textAlign: 'center',
  padding: '75px 20px',  // Added some responsive padding on smaller screens
  height: '100vh',  // Make it take up the full viewport height
  margin: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  fontFamily: 'Great Vibes',  // Apply the Great Vibes font
};

const headingStyle = {
  color: '#000000',
  fontSize: '3rem',
  marginBottom: '10px',  // Give some breathing room below the heading
};

const paragraphStyle = {
  color: '#000000',
  fontSize: '1.2rem',
  margin: '5px 0',  // Even out margins for the paragraph
};

function HomePage() {
  return (
    <div style={pageStyle}> {/* Apply pageStyle to the div */}
      <h1 style={headingStyle}>Mellowdies</h1> {/* Apply headingStyle to the h1 */}
      <p style={paragraphStyle}>Welcome To Your Audio Editing Platform!</p> {/* Apply paragraphStyle to the p */}
      <p style={paragraphStyle}>Upload File</p> {/* Apply paragraphStyle to the p */}
    </div>
  );
}

export default HomePage;
