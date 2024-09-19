import React from 'react';
import gifBackground from './images/skybackground.png';  // Adjust the path if needed
import  { useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { useNavigate } from 'react-router-dom';  // Ensure useNavigate is imported correctly
import Landingpage from './Landingpage.js';




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
    const navigate = useNavigate();  // Initialize useNavigate

    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Get the selected file from the event
        console.log(file); 
        if (file) {
        navigate('/Landingpage');
        }
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
            console.log('Google Drive callback data:', data);

            if (data.action === 'picked') { // Ensure you're checking for 'picked' action, which means files were selected
                console.log('Files selected from Google Drive:', data.docs);

                if (data.docs && data.docs.length > 0) {
                    navigate('/Landingpage');  // Navigate to Landingpage after files are selected
                } else {
                    console.log('No files selected');
                }
            } else {
                console.log('User canceled or closed the picker');
            }
          },
        })
        console.log('Google Drive clicked');
      };
    
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>  {/* Container to hold text at the top */}
        <h1 style={headingStyle}>Mellowdies</h1>
        <p style={paragraphStyle}>Upload a file!</p>

        <input type="file" style={buttonStyle} onChange={handleFileUpload} /> {/* Make sure the function is used here */}

         <button style={buttonStyle} onClick={handleGoogleDrive}> {/* Additional upload buttons */}
             Upload from Google Drive
         </button>

      </div>
    </div>
  );
}

export default HomePage;
