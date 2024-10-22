import React, { useState } from "react";

const menubackground = { /* styles remain unchanged */ };
const generateButtonStyle = { /* styles remain unchanged */ };
const descriptionBoxStyle = { /* styles remain unchanged */ };
const backButtonStyle = { /* styles remain unchanged */ };
const contentStyle = { /* styles remain unchanged */ };

function AIMenu({ handleBack }) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // New state to store the uploaded file
  const [errorMessage, setErrorMessage] = useState(null);
  const [progressMessage, setProgressMessage] = useState(null);

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

    try {
      const formData = new FormData(); // Create form data object to send description and file
      formData.append("description", description);
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
        <textarea
          style={descriptionBoxStyle}
          placeholder="Describe your music..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
