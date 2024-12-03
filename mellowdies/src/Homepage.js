import gifBackground from './images/backgrounds/yea.png';  
import  { useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { useNavigate } from 'react-router-dom';  
import React, { useRef, useState } from 'react';



const pageStyle = {
  backgroundImage: `url(${gifBackground})`,  
  backgroundSize: 'cover',  
  backgroundPosition: 'center',  
  textAlign: 'center',
  padding: '20px',  
  height: '100vh',  
  margin: 0,
  display: 'flex',
  flexDirection: 'column',  
  alignItems: 'center',
  fontFamily: 'Concert One',  
};

const headingStyle = {
    color: '#000000',  
    fontSize: '3.5rem',
    textShadow: '6px 6px 10px pink, -6px -6px 10px pink, 6px -6px 10px pink, -6px 6px 10px pink',  
    marginBottom: '10px',  
    marginTop: '0',  
  };
  

const paragraphStyle = {
  color: '#111111',
  fontSize: '2rem',
  margin: '5px 0',  
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',  
  width: '100%',  
  paddingTop: '50px',  
};

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '30px',  
    border: '2px solid #ffffff',  
    backgroundColor: 'rgba(255, 255, 255, 0.5)',  
    color: '#000',  
    fontFamily: "'Concert One', cursive",  
    cursor: 'pointer',
    marginTop: '15px',  
    width: '300px',  
    textAlign: 'center',
    fontSize: '1.2rem',
    boxShadow: '3px 3px 5px white, -3px -3px 5px white, 3px -3px 5px white, -3px 3px 5px white',  
  };
  
  

function HomePage() {
    const navigate = useNavigate();  

    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => { //***/
      const files = event.target.files;
  
      if (!files || files.length === 0) {
          alert('No files selected. Please choose audio files to proceed.');
          return;
      }
  
      const audioFiles = Array.from(files).reduce((accumulator, file) => {
          if (file.type.startsWith('audio/')) {
              accumulator.push({
                  name: file.name,
                  url: URL.createObjectURL(file),
                  mimeType: file.type,
                  size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, 
                  lastModified: new Date(file.lastModified).toLocaleString(), 
              });
          } else {
              console.warn(`Skipped non-audio file: ${file.name}`);
          }
          return accumulator;
      }, []);
  
      if (audioFiles.length > 0) {
          console.log('Audio files prepared for navigation:', audioFiles);
              navigate('/Landingpage', { 
                  state: { 
                      audioFiles,
                      uploadTime: new Date().toISOString() 
                  } 
              });
          }
      else {
          alert('No valid audio files found. Please ensure the files are audio.');
      }
  };
  
    
    
      
      const [openPicker, authResponse] = useDrivePicker();
      const handleGoogleDrive = () => {
        openPicker({
            clientId: "473620447998-mljs5baieqfr2bfk9berae2suhb7fqag.apps.googleusercontent.com",
            developerKey: "AIzaSyApSN-CVcrcURGIUIAS3wtNgIlOszHwk2k",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            viewId: "AUDIO", 
            mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav', 'audio/x-m4a', 'audio/flac'], 
            callbackFunction: (data) => {
                console.log('Google Drive callback data:', data);
    
                if (data.action === 'picked') {
                    const audioFiles = data.docs.map(doc => ({
                        name: doc.name,
                        url: doc.url, 
                        mimeType: doc.mimeType
                    }));

                    if (audioFiles.length > 0) {
                        navigate('/Landingpage', { state: { audioFiles } });  
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
    
    const handleFilesButtonClick = () => {
      fileInputRef.current.click();
    };
    
  return (
    <div style={pageStyle}>
      <div style={containerStyle}> 
        <h1 style={headingStyle}>MELLOWDIES</h1>
        

        <button style={buttonStyle} onClick={handleFilesButtonClick}> 
             FILES
         </button>

         <button style={buttonStyle} onClick={handleGoogleDrive}> 
             GOOGLE DRIVE
         </button>

         <button style={buttonStyle} onClick={handleNoFile}> 
             CONTINUE WITHOUT UPLOAD
         </button>

         <input
                type="file"
                multiple
                ref={fileInputRef}
                accept='audio/*'
                style={{ display: 'none' }}
                onChange={handleFileUpload} 
            />

      </div>
    </div>
  );
}

export default HomePage;
