import { client } from "@gradio/client";
import fs from 'fs';
import axios from 'axios';

async function downloadFile(url, outputPath) {
  const writer = fs.createWriteStream(outputPath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function testMusicGenAPI() {
  try {
    console.log("Connecting to the MusicGen API...");
    
    // Connect to the MusicGen API
    const app = await client("https://facebook-musicgen.hf.space/");
    console.log("Connected to the API. Submitting a simple request...");

    // Minimal request with just a text input (no audio input)
    const result = await app.predict(0, [
      "Howdy!"  // Just a string input
    ]);

    console.log("Generated Music Result:", result?.data);

    // Extract the .wav file URL from the result
    const wavFilePath = result?.data[1]?.name;
    
    if (wavFilePath) {
      console.log("Downloading the WAV file...");

      // Download the .wav file
      const fileUrl = `https://facebook-musicgen.hf.space${wavFilePath}`;
      await downloadFile(fileUrl, './generated_music.wav');
      console.log("WAV file downloaded successfully: generated_music.wav");
    } else {
      console.error("No WAV file URL found.");
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error status code:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received, error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
}

testMusicGenAPI();


