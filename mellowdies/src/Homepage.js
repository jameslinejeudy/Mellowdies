import React from 'react';
import gifBackground from './images/skybackground.png';  // Adjust the path if needed

const pageStyle = {
  backgroundImage: `url(${gifBackground})`,  // Set the image as the background
  backgroundSize: 'cover',  // Ensures the image covers the entire page
  backgroundPosition: 'center',  // Centers the background
  textAlign: 'center',
  padding: '20px',  // Adjust the padding
  height: '100vh',  // Full viewport height
  margin: 0,
  display: 'flex',
  flexDirection: 'column',  // Arrange children in a column
  alignItems: 'center',
  fontFamily: 'Concert One',  // Use Concert One font
};

const headingStyle = {
    color: '#000000',  // Black text color
    fontSize: '3rem',
    textShadow: '3px 3px 5px pink, -3px -3px 5px pink, 3px -3px 5px pink, -3px 3px 5px pink',  // Larger pink outline effect
    marginBottom: '10px',  // Space below the heading
    marginTop: '0',  // Space above the heading
  };
  

const paragraphStyle = {
  color: '#111111',
  fontSize: '1.2rem',
  margin: '5px 0',  // Even out margins for the paragraph
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',  // Align text at the top
  width: '100%',  // Full width
  paddingTop: '50px',  // Add some padding from the top
};

const uploadStyle = {
    marginTop: '20px',  // Space above the upload box
    padding: '10px',
    borderRadius: '5px',
    border: '2px solid #000',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
  };

function HomePage() {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>  {/* Container to hold text at the top */}
        <h1 style={headingStyle}>Mellowdies</h1>
        <p style={paragraphStyle}>Welcome To Your Audio Editing Platform!</p>
        <p style={paragraphStyle}>Upload File</p>
        {/* Upload input below the text */}
        <input type="file" style={uploadStyle} />
      </div>
    </div>
  );
}

export default HomePage;
