import React from 'react';
import gifBackground from './images/backgrounds/yea.png';  // Adjust the path if needed
import  { useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { useNavigate } from 'react-router-dom';  // Ensure useNavigate is imported correctly




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
        const files = event.target.files;
        const audioFiles = Array.from(files).map(file => ({
            name: file.name,
            url: URL.createObjectURL(file), // Creates a temporary URL for the file
            mimeType: file.type
        }));

        if (audioFiles.length > 0) {
            navigate('/Landingpage', { state: { audioFiles } });  // Pass audio files as state
        } else {
            alert('Please select audio files.');
        }
    };
    
    
      // Google Drive Integration
      const [openPicker, authResponse] = useDrivePicker();
      const handleGoogleDrive = () => {
        openPicker({
            clientId: "473620447998-mljs5baieqfr2bfk9berae2suhb7fqag.apps.googleusercontent.com",
            developerKey: "AIzaSyApSN-CVcrcURGIUIAS3wtNgIlOszHwk2k",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            viewId: "AUDIO", // or you can remove this if it restricts the file types incorrectly
            mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav', 'audio/x-m4a', 'audio/flac'], // Allow specific audio types
            callbackFunction: (data) => {
                console.log('Google Drive callback data:', data);
    
                if (data.action === 'picked') {
                    const audioFiles = data.docs.map(doc => ({
                        name: doc.name,
                        url: doc.url, // This should be a direct link to access the file
                        mimeType: doc.mimeType
                    }));

                    if (audioFiles.length > 0) {
                        navigate('/Landingpage', { state: { audioFiles } });  // Pass audio files as state
                    } else {
                        alert('Please select only audio files.');
                    }
                }
            },
        });
        console.log('Google Drive clicked');
    };

    const handleNoFile = () => {
      navigate('/Landingpage');
    }
    
    
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>  {/* Container to hold text at the top */}
        <h1 style={headingStyle}>MELLOWDIES</h1>
        //<p style={paragraphStyle}>UPLOAD AN AUDIO FILE TO START</p>//

        {/* Accept only audio files */}
        <input
            type="file"
            style={buttonStyle}
            multiple  
            accept="audio/*"  // This restricts file selection to audio files only
            onChange={handleFileUpload}
        />


         <button style={buttonStyle} onClick={handleGoogleDrive}> {/* Additional upload buttons */}
             Google Drive
         </button>

        {/* If they want to just go to the workspace and add tracks from there */}
         <button style={buttonStyle} onClick={handleNoFile}> {/* Additional upload buttons */}
             Continue Without Upload
         </button>

      </div>
    </div>
  );
}

export default HomePage;
