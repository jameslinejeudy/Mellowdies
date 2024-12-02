import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload'; // Import the file upload middleware
import { client } from '@gradio/client';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(fileUpload()); // Enable file upload handling

app.post('/api/generate-music', async (req, res) => {
  const { description, apiChoice, fn_index } = req.body; // Accept the fn_index for new API
  const uploadedFile = req.files ? req.files.file : null; // Check if a file was uploaded

  console.log(`[Server] Received request to generate music for description: "${description}" with API choice: "${apiChoice}"`);

  try {
    if (apiChoice === "old") {
      // OLD API Implementation
      console.log("[Server] Using old API...");

      // Properly create a client instance for the old API
      const oldClient = await client("https://facebook-musicgen.hf.space/");
      console.log("[Server] Connected to the old API.");

      // Predict using the proper method call
      const result = await oldClient.predict(0, [description || uploadedFile?.name]);
      console.log("[Server] Received response from old MusicGen API:", result?.data);

      // Handle the response and download logic
      const wavFilePath = result?.data?.[1]?.name;
      if (!wavFilePath) {
        console.error("[Server] No WAV file found in the result from old API.");
        return res.status(500).send("No WAV file found in the result from old API.");
      }

      const wavFileUrl = `https://facebook-musicgen.hf.space/file=${wavFilePath}`;
      console.log("[Server] WAV file URL from old API:", wavFileUrl);

      const response = await fetch(wavFileUrl);
      const buffer = await response.buffer();
      const filePath = path.join(process.cwd(), `${description || "uploaded_file"}_generated_music.wav`);
      fs.writeFileSync(filePath, buffer);

      res.sendFile(filePath, () => {
        console.log("[Server] File sent to frontend from old API. Cleaning up...");
        fs.unlinkSync(filePath); // Remove the file after sending
      });

    } else if (apiChoice === "new") {
      // NEW API Implementation
      console.log("[Server] Using new API...");

      // Create a client instance for the new API
      const newClient = await client("https://keviny0061-musicgen.hf.space/");
      console.log("[Server] Connected to the new API.");
      console.log(`[Server] Received fn_index: ${fn_index}`);
      let result;
      console.log(`[Server] Received fn_index after let index: ${fn_index}`);

      // Adjust the request based on the fn_index (use cases based on the documentation)
      if (fn_index == 0) {
        console.log("[Server] fn_index is 0. Sending prediction request to API with description:", description);
        result = await newClient.predict(0);
    }
     else if (fn_index == 1) {
      console.log("[Server] fn_index is 1. Sending prediction request to API...");
      result = await newClient.predict("Default", fn_index);
      } 
      else if (fn_index == 2) {
        console.log("[Server] fn_index is 2. Sending prediction request to API...");
    result = await newClient.predict(
      "facebook/musicgen-melody",  // Model
      description || "Howdy!",     // Input text
      "Default",                   // Decoder
      "",                          // Model path
      "",                          // Optional file URL
      1,                           // Duration
      5,                           // Top-k
      5,                           // Top-p
      5,                           // Temperature
      5,                           // Classifier Free Guidance
      fn_index
    );
      } else {
        console.log("[Server] Invalid fn_index for new API.");
        return res.status(400).send("[Server] Invalid fn_index for the new API.");
      }

      // Log detailed response from new API
      console.log("[Server] Full response from new MusicGen API:", result);

      // Check if the API returned a valid WAV file
      const wavFilePath = result?.data?.[1];  // Adjust depending on the response structure
      if (!wavFilePath) {
        console.error("[Server] No WAV file found in the result from new API.");
        return res.status(500).send("No WAV file found in the result from new API.");
      }

      const wavFileUrl = `https://keviny0061-musicgen.hf.space/file=${wavFilePath}`;
      console.log("[Server] WAV file URL from new API:", wavFileUrl);

      // Download and send the file to the client (same logic as before)
      const response = await fetch(wavFileUrl);
      const buffer = await response.buffer();
      const filePath = path.join(process.cwd(), `${description || "uploaded_file"}_generated_music.wav`);
      fs.writeFileSync(filePath, buffer);
      console.log("[Server] Download complete. File saved at:", filePath);

      res.sendFile(filePath, () => {
        console.log("[Server] File sent to frontend from new API. Cleaning up...");
        fs.unlinkSync(filePath); // Remove the file after sending
      });
    } else {
      res.status(400).send("[Server] Invalid API choice.");
    }

  } catch (error) {
    console.error("[Server] Error during music generation or file transfer:", error);
    res.status(500).send(`Failed to generate or download music. Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`[Server] Backend server running on http://localhost:${port}`);
});
