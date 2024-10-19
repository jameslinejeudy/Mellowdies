import express from 'express';
import cors from 'cors';
import { client } from '@gradio/client';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/generate-music', async (req, res) => {
  const { description } = req.body.description;
  const { audioURL } = req.body.regionURL;

  try {
    console.log(`[Server] Received request to generate music for description: "${description}"`);

    // Connect to the MusicGen API
    console.log("[Server] Connecting to the MusicGen API...");
    const musicClient = await client("https://facebook-musicgen.hf.space/");
    console.log("[Server] Connected to the MusicGen API.");

    // Request music generation
    console.log("[Server] Sending generation request to MusicGen API...");
    const result = await musicClient.predict(0, [description], [audioURL]);
    console.log("[Server] Received response from MusicGen API:", result?.data);

    // Extract WAV file path
    const wavFilePath = result?.data?.[1]?.name;
    if (!wavFilePath) {
      console.error("[Server] No WAV file found in the result.");
      return res.status(500).send("No WAV file found in the result.");
    }

    const wavFileUrl = `https://facebook-musicgen.hf.space/file=${wavFilePath}`;
    console.log("[Server] WAV file URL:", wavFileUrl);

    // Download the file
    console.log("[Server] Downloading generated music file...");
    const response = await fetch(wavFileUrl);
    const buffer = await response.buffer();
    const filePath = path.join(process.cwd(), `${description}_generated_music.wav`);
    fs.writeFileSync(filePath, buffer);
    console.log("[Server] Download complete. File saved at:", filePath);

    // Send file back to the frontend
    res.sendFile(filePath, () => {
      console.log("[Server] File sent to frontend. Cleaning up...");
      fs.unlinkSync(filePath); // Remove the file after sending
    });
  } catch (error) {
    console.error("[Server] Error during music generation or file transfer:", error);
    res.status(500).send("Failed to generate or download music.");
  }
});

app.listen(port, () => {
  console.log(`[Server] Backend server running on http://localhost:${port}`);
});
