import React from 'react';
import gifBackground from './images/skybackground.png';  // Adjust the path if needed
import  { useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker'


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
    fontSize: '3.5rem',
    textShadow: '6px 6px 10px pink, -6px -6px 10px pink, 6px -6px 10px pink, -6px 6px 10px pink',  // Larger pink outline effect
    marginBottom: '10px',  // Space below the heading
    marginTop: '0',  // Space above the heading
  };
  

const paragraphStyle = {
  color: '#111111',
  fontSize: '2rem',
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
    borderRadius: '30px',
    border: '2px solid #ffffff',  // Sharp white border
    fontSize: '1.5rem',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',  // Slightly transparent white background
    boxShadow: '3px 3px 5px white, -3px -3px 5px white, 3px -3px 5px white, -3px 3px 5px white',  // Larger pink outline effect
    color: '#000',  // Ensures the text inside is still visible
    fontFamily: 'Concert One',  // Use Concert One font
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '30px',  // Rounded corners for the buttons
    border: '2px solid #ffffff',  // Sharp white border
    backgroundColor: 'rgba(255, 255, 255, 0.5)',  // Slightly transparent white background
    color: '#000',  // Black text color
    fontFamily: "'Concert One', cursive",  // Apply Concert One font
    cursor: 'pointer',
    marginTop: '15px',  // Space between the buttons
    width: '300px',  // Button width
    textAlign: 'center',
    fontSize: '1.2rem',
    boxShadow: '3px 3px 5px white, -3px -3px 5px white, 3px -3px 5px white, -3px 3px 5px white',  // Larger pink outline effect
  };
  
  

function HomePage() {
    const handleFileUpload = (event) => {
        console.log(event.target.files[0]); // Handle file upload
      };
    
      // Google Drive Integration
      const [openPicker, authResponse] = useDrivePicker();
      const handleGoogleDrive = () => {
        // Logic for Google Drive integration
        openPicker({
          clientId: "473620447998-mljs5baieqfr2bfk9berae2suhb7fqag.apps.googleusercontent.com",
          developerKey: "AIzaSyApSN-CVcrcURGIUIAS3wtNgIlOszHwk2k",
          viewId: "DOCS",
          showUploadView: true,
          showUploadFolders: true,
          supportDrives: true,
          multiselect: true,
          callbackFunction: (data) => {
            if (data.action === 'cancel') {
              console.log('User clicked cancel/close button')
            }
            console.log(data)
          },
        })
        console.log('Google Drive clicked');
      };
    
      const handleDropbox = () => {
        // Logic for Dropbox integration
        console.log('Dropbox clicked');
      };
    
      const handleOneDrive = () => {
        // Logic for OneDrive integration
        console.log('OneDrive clicked');
      };
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>  {/* Container to hold text at the top */}
        <h1 style={headingStyle}>Mellowdies</h1>
        <p style={paragraphStyle}>Upload a file!</p>
        <input type="file" style={buttonStyle} />
         {/* Additional upload buttons */}
         <button style={buttonStyle} onClick={handleGoogleDrive}>
          Upload from Google Drive
        </button>
        <button style={buttonStyle} onClick={handleDropbox}>
          Upload from Dropbox
        </button>
        <button style={buttonStyle} onClick={handleOneDrive}>
          Upload from OneDrive
        </button>
      </div>
    </div>
  );
}

export default HomePage;
