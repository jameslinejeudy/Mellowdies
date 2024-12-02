const fs = require('fs');
const axios = require('axios');

// Helper function to pause execution for a specified amount of time
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testMusicGenAPI() {
  try {
    // Dynamically import the @gradio/client package
    const { client } = await import('@gradio/client');
    
    // Connect to the MusicGen API
    console.log("Connecting to the MusicGen API...");
    const app = await client("https://facebook-musicgen.hf.space/");
    console.log("Connected to the API. Submitting a request with fn_index: 0...");

    // Submit a request to the MusicGen API (fn_index: 0)
    const result = await app.predict(0, ["Sad music"]);
    console.log("Generated Music Result:", result?.data);

    const wavFilePath = result?.data?.[1]?.name;
    if (!wavFilePath) {
      console.error("No WAV file found in the result.");
      return;
    }

    const wavFileUrl = `https://facebook-musicgen.hf.space/file=${wavFilePath}`;
    console.log("WAV file URL:", wavFileUrl);


    // Attempt to download the WAV file
    const outputPath = './downloaded_music.wav';
    console.log("Downloading the WAV file...");
    const success = await downloadFile(wavFileUrl, outputPath);
    if (success) {
      console.log("WAV file downloaded successfully to", outputPath);
    } else {
      console.log("Check your project directory for file...");
    }

  } catch (error) {
    console.error("Error occurred:", error);
  }
}

async function downloadFile(fileUrl, outputPath) {
  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
    });

    if (response.headers['content-length'] === '0') {
      console.error('Error: File is empty (content-length is zero).');
      return false;
    }

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    if (error.response) {
      console.error("Error response received from server:", error.response);
    } else {
      console.error("Error:", error.message);
    }
    return false;
  }
}

testMusicGenAPI();

