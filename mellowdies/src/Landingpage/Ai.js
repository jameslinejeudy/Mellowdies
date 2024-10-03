import menubutton from '../images/menubutton.png';
import React, { useState, useEffect } from "react";
import { Client } from "@gradio/client";

// CSS styling for the component
const menubackground = {
  width: '25%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'left',
  border: '2px solid #ffffff',
  backgroundColor: '#ffffff',
  fontFamily: "'Concert One', cursive",
  fontSize: '1.2rem',
  boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',
  border: 'none',
  position: 'fixed',
  top: '0',
  left: '0',
  zIndex: '1000',
  paddingTop: '50px',
};

const backbuttonStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: '1%',
  left: '0.5%',
  zIndex: '1001',
  cursor: 'pointer',
  backgroundColor: 'rgba(255, 255, 255, 0.0)',
  border: 'none',
  padding: '0',
  width: 'auto',
  height: 'auto',
};

const textstyle = {
  color: '#000000',
  fontSize: '2rem',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '50px',
};

const backButtonStyle = {
  marginTop: '10px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  textAlign: 'center',
  width: 'auto',
  display: 'inline-block',
  transition: 'background 0.3s ease',
};

const contentStyle = {
  flexGrow: 1,
  paddingTop: '60px',
};

const generateButtonStyle = {
  marginTop: '20px',
  background: '#28a745',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  textAlign: 'center',
  width: 'auto',
  display: 'inline-block',
  transition: 'background 0.3s ease',
};

const descriptionBoxStyle = {
  marginTop: '20px',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '90%',
};

async function generateMusic(description, audioFileUrl) {
  try {
    console.log("Sending request to the backend proxy...");

    const response = await fetch('http://localhost:3001/api/musicgen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: description,
        audioUrl: audioFileUrl,
        fn_index: 0  // Using fn_index 0 for text-to-music
      })
    });

    const result = await response.json();
    
    // Log the actual result to see what the API is returning
    console.log("Music generation result:", result);
    
    if (result) {
      return result;
    } else {
      console.error("Failed to generate music.");
      return null;
    }
  } catch (error) {
    console.error("Error in music generation:", error);
  }
}


// Example usage:
const description = "happy rock";
const audioFileUrl = "https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav";

generateMusic(description, audioFileUrl).then((audio) => {
  if (audio) {
    console.log("Generated music:", audio);
  }
});


// Counter to track the number of connection attempts (for testing)
let i = 0;

function someFunction() {
  i++; // Increment the counter each time this line is reached
  alert(`Trying to connect to API for the ${i} time`); // Display the count in the alert
}

// Main AIMenu Component
function AIMenu({ handleBack }) {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [app, setApp] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const connectToClient = async () => {
      try {
        someFunction(); // Call the counter for testing
        console.log("Connecting to API...");
        const appInstance = await Client.connect("https://facebook-musicgen.hf.space/");
        console.log("Connected to API:", appInstance);
        setApp(appInstance);
      } catch (error) {
        console.error("Failed to connect to the API:", error);
        setErrorMessage("Failed to connect to the MusicGen API. Please try again later.");
      }
    };
  
    connectToClient();
  }, []); // Empty dependency array to ensure it only runs once
  

  const handleGenerateMusic = async () => {
    alert("Reached line 132");
  
    // Ensure the app is connected before proceeding
    if (!app) {
      alert('App is still connecting, please wait.');
      return;
    }
  
    setLoading(true);
    setAudioUrl(null); // Reset audio URL before generating
    try {
      const result = await generateMusic(app, description);
      console.log("API Result:", result);
  
      if (result && result[1]) {
        setAudioUrl(URL.createObjectURL(result[1])); // Assuming result[1] contains the audio blob
      } else {
        throw new Error("No audio data returned from the music generation API.");
      }
    } catch (error) {
      console.error("Error generating music:", error);
      alert(`Failed to generate music: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div style={menubackground}>
      <div style={contentStyle}>
        <h1>This Is The AI Menu</h1>
        {/* Textbox for user to input description */}
        <textarea
          style={descriptionBoxStyle}
          placeholder="Describe your music..."
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update state on change
        />
        {/* Button to generate music */}
        <button style={generateButtonStyle} onClick={handleGenerateMusic} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Music'}
        </button>
        {/* If an audio URL is available, provide a way to play it */}
        {audioUrl && (
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio tag.
          </audio>
        )}
        {/* Back button to close the menu */}
        <button style={backButtonStyle} onClick={handleBack}>Back</button>
      </div>
    </div>
  );
}

export default AIMenu;
