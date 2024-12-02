import React, { useState } from "react";

var toWav = require('audiobuffer-to-wav');
var slicer = require('audiobuffer-slice');
let wavURL = "";
let sliceBuffer = null;

const menubackground = { /* styles remain unchanged */ };

const contentStyle = {   
  display: "flex",
  flexDirection: "column",
  /*alignItems: "center", */
  justifyContent: "center", 
  padding: "20px",
  maxWidth: "600px", 
  width: "100%",
};

const buttonBaseStyle = {
  padding: "10px 20px",
  fontSize: "20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  fontFamily: "'Concert One', cursive",
};

const generateButtonStyle = {
  ...buttonBaseStyle,
  backgroundColor: "#7d4998",
  color: "white",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  marginBottom: "10px",
  marginTop: "10px",
};

const backButtonStyle = {
  ...buttonBaseStyle,
  backgroundColor: "#b86999",
  color: "white",
  marginLeft: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  position: "absolute",
  bottom: "20px",
  right: "20px",
};

const hoverEffectStyle = {
  transform: "scale(1.05)",
  boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
};

const descriptionBoxStyle = {
  width: "100%",
  height: "150px",
  padding: "15px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  resize: "none", 
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
};

const descriptionBoxHoverStyle = {
  borderColor: "#A020F0",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const inputFileStyle = {
  display: "inline-block",
  backgroundColor: "#5c6073",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.3s ease",
  textAlign: "center"
}

const inputFileHoverStyle = {
  backgroundColor: "#3f4349", // Darker color on hover
};

function getAudioSlice(buffer, region) {
  slicer(buffer, region.start * 1000, region.end * 1000, function(error, slicedBuffer) {
      if (error) {
          console.error(error);
          return;
      } else {
          sliceBuffer = slicedBuffer;
      }
  })
  return sliceBuffer;
}

function bufferToWavURL(buffer) {
  var blob = new window.Blob([new DataView(toWav(buffer))], {type: "audio/wav"});
  wavURL = window.URL.createObjectURL(blob);
  return wavURL;
}

function AIMenu({ handleBack, waveData }) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [apiChoice, setApiChoice] = useState("old");  // New state for API selection
  const [errorMessage, setErrorMessage] = useState(null);
  const [progressMessage, setProgressMessage] = useState(null);
  const [sendToAI, setSendToAI] = useState(false);  // Checkbox state
  const [hover, setHover] = useState({ generate: false, back: false });
  let wavURL = "";

  const handleMouseEnter = (button) => setHover({ ...hover, [button]: true });
  const handleMouseLeave = (button) => setHover({ ...hover, [button]: false });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Capture the uploaded file
  };

  const handleGenerateMusic = async () => {
    if (!description && !file) {
      setErrorMessage("Please provide a description or upload a file.");
      return;
    }
  
    setLoading(true);
    setErrorMessage(null);
    setProgressMessage("Connecting to the server...");
  
    // Select the fn_index based on the API choice
    let fn_index = 0; // Default to 0 if you want to test fn_index 0
  
    if (apiChoice === "new") {
      // Adjust this based on user selection or logic
      fn_index = 0;  // Change this value depending on what you want to pass for testing
    }

    if (sendToAI != false) {
      let buffer = waveData[0].waveSurfer.getDecodedData();
      let region = (waveData[0].regions.getRegions())[0];
      let slicedBuffer = getAudioSlice(buffer, region);
      wavURL = bufferToWavURL(slicedBuffer);
      console.log(wavURL);
    }
  
    try {
      const formData = new FormData(); // Create form data object to send description, file, and fn_index
      formData.append("description", description);
      formData.append("audio", wavURL);
      formData.append("apiChoice", apiChoice); // Include the API choice
      formData.append("fn_index", fn_index); // Include the fn_index for new API
      if (file) formData.append("file", file);
  
      const response = await fetch("http://localhost:3001/api/generate-music", {
        method: "POST",
        body: formData, // Send form data instead of JSON
      });
      
      console.log(formData);
      
      if (!response.ok) {
        throw new Error("Server failed to generate music.");
      }

      console.log("Connected to server.");
  
      setProgressMessage("Generating music on server...");
  
      const blob = await response.blob();
      setProgressMessage("Downloading generated music file...");
  
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${description || "uploaded_file"}_generated_music.wav`;
  
      // Trigger download
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
  
      setProgressMessage("Download complete. Check your Downloads folder.");
    } catch (error) {
      console.error("Error during music generation or download:", error);
      setErrorMessage(`Failed to generate or download music: ${error.message}`);
      setProgressMessage(null);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={menubackground}>
      <div style={contentStyle}>
        <h1>AI Music Generator</h1>
        <label>Edit Imported Track</label>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        {progressMessage && <div style={{ color: "blue" }}>{progressMessage}</div>}

        <textarea
          style={{
            ...descriptionBoxStyle,
            ...(hover ? descriptionBoxHoverStyle : {}),
          }}
          placeholder="Describe your music..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={sendToAI}
              onChange={(e) => setSendToAI(e.target.checked)}
            />
            Only edit selected region
          </label>
        </div>
        <label style={{ display: "block", marginTop: "10px" }}>OR</label>
        <label style={{ display: "block", marginTop: "10px" }}>Edit New Track</label>
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="audio/*"
          />
          <label htmlFor="file-input"
            style={{
              ...inputFileStyle,
              ...(hover.inputFile ? inputFileHoverStyle : {}),
            }}
            onMouseEnter={() => handleMouseEnter("inputFile")}
            onMouseLeave={() => handleMouseLeave("inputFile")}>
            Choose a file
          </label>
        </div>
        <button
          style={{
            ...generateButtonStyle,
            ...(hover.generate ? hoverEffectStyle : {}),
          }}
          onClick={handleGenerateMusic}
          onMouseEnter={() => handleMouseEnter("generate")}
          onMouseLeave={() => handleMouseLeave("generate")}
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Music"}
        </button>
        <button
          style={{
            ...backButtonStyle,
            ...(hover.back ? hoverEffectStyle : {}),
          }}
          onClick={handleBack}
          onMouseEnter={() => handleMouseEnter("back")}
          onMouseLeave={() => handleMouseLeave("back")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default AIMenu;
