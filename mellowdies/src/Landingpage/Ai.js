import React, { useState } from "react";

const menubackground = { /* styles remain unchanged */ };
const generateButtonStyle = { /* styles remain unchanged */ };
const descriptionBoxStyle = { /* styles remain unchanged */ };
const backButtonStyle = { /* styles remain unchanged */ };
const contentStyle = { /* styles remain unchanged */ };

var toWav = require('audiobuffer-to-wav');
var slicer = require('audiobuffer-slice');
let wavURL = "";
let sliceBuffer = null;

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
  
    try {
      const formData = new FormData(); // Create form data object to send description, file, and fn_index
      formData.append("description", description);
      formData.append("apiChoice", apiChoice); // Include the API choice
      formData.append("fn_index", fn_index); // Include the fn_index for new API
      if (file) formData.append("file", file);
  
      const response = await fetch("http://localhost:3001/api/generate-music", {
        method: "POST",
        body: formData, // Send form data instead of JSON
      });
  
      if (!response.ok) {
        throw new Error("Server failed to generate music.");
      }
  
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
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        {progressMessage && <div style={{ color: "blue" }}>{progressMessage}</div>}

        {/* Dropdown for API selection */}
        <label htmlFor="apiChoice">Choose API:</label>
        <select
          id="apiChoice"
          value={apiChoice}
          onChange={(e) => setApiChoice(e.target.value)}
          disabled={loading}
        >
          <option value="old">Old API</option>
          <option value="new">New API</option>
        </select>

        <textarea
          style={descriptionBoxStyle}
          placeholder="Describe your music..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={sendToAI}
              onChange={(e) => setSendToAI(e.target.checked)}
            />
            Send selected music region to AI
          </label>
        </div>
        <input type="file" onChange={handleFileChange} /> {/* Add file input */}
        <button style={generateButtonStyle} onClick={handleGenerateMusic} disabled={loading}>
          {loading ? "Processing..." : "Generate Music"}
        </button>
        <button style={backButtonStyle} onClick={handleBack}>Back</button>
      </div>
    </div>
  );
}

export default AIMenu;
