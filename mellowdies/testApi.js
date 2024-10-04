import fs from 'fs';
import axios from 'axios';
import { client } from "@gradio/client";

// Helper function to pause execution for a specified amount of time
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function testMusicGenAPI() {
  try {
    // Connect to the MusicGen API
    console.log("Connecting to the MusicGen API...");
    const app = await client("https://facebook-musicgen.hf.space/");
    console.log("Connected to the API. Submitting a request with fn_index: 0...");

    // Submit a request to the MusicGen API (fn_index: 0)
    const result = await app.predict(0, ["Taylor swift"]);
    console.log("Generated Music Result:", result?.data);

    const wavFilePath = result?.data?.[1]?.name;
    if (!wavFilePath) {
      console.error("No WAV file found in the result.");
      return;
    }

    const wavFileUrl = `https://facebook-musicgen.hf.space/file=${wavFilePath}`;
    console.log("WAV file URL:", wavFileUrl);

    // Introduce a delay of 1 minute (60000 milliseconds) before checking the file
    

    // Attempt to download the WAV file
    const outputPath = './downloaded_music.wav';
    console.log("Downloading the WAV file...");
    const success = await downloadFile(wavFileUrl, outputPath);
    if (success) {
      console.log("WAV file downloaded successfully to", outputPath);
    } else {
      console.log("WAV file could not be downloaded."); //wav file could not be downloaded!
    }

  } catch (error) {
    console.error("Error occurred:", error);
  }
}

async function downloadFile(fileUrl, outputPath) {
  try {
    console.log("DownloadFile location 0");
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
    });
    console.log("DownloadFile location 1");

    if (response.headers['content-length'] === '0') {
      console.error('Error: File is empty (content-length is zero).');
      return false;
    }
    console.log("DownloadFile location 2");

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    console.log("DownloadFile location 3");
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    if (error.response) {
      console.error("Error response received from server:");
      console.error("Status:", error.response.status); // Log status code
      console.error("Data:", error.response.data);     // Log error details
      console.error("Headers:", error.response.headers); // Log response headers
      console.error("Config:", error.config);          // Log request configuration
    } else {
      console.error("Error:", error.message);
    }
    return false;
  }
}

testMusicGenAPI();
