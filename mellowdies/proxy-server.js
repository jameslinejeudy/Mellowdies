const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import CORS middleware
const FormData = require('form-data'); // To handle file uploads
const fetch = require('node-fetch'); // To fetch the audio file from URL

const app = express();
const port = 3001;

// Enable CORS for all routes (allow requests from localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',  // Allow your frontend origin
}));

// Set up the proxy route for MusicGen API
app.use(express.json());

app.post('/api/musicgen', async (req, res) => {
  const { description, audioUrl, fn_index } = req.body;

  try {
    console.log("Sending request to MusicGen API with data:", { description, audioUrl, fn_index });

    // Step 1: Download the audio file from the provided URL
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.buffer(); // Get the audio as a buffer (file)

    // Step 2: Create form data for sending to the MusicGen API
    const formData = new FormData();
    formData.append('data', description);  // Add description input
    formData.append('file', audioBuffer, 'audio_sample.wav');  // Add audio blob input
    formData.append('fn_index', fn_index);  // Add the function index

    // Step 3: Make a request to the MusicGen API from the backend
    const response = await axios.post('https://facebook-musicgen.hf.space/api/predict/', formData, {
      headers: {
        ...formData.getHeaders() // Use correct headers for multipart/form-data
      }
    });

    // Step 4: Log the successful response from the MusicGen API
    console.log("Received response from MusicGen API:", response.data);

    // Forward the MusicGen API response back to the client
    res.json(response.data);

  } catch (error) {
    // Log the error details
    console.error('Error fetching data from MusicGen API:', error.response ? error.response.data : error.message);

    // If the error response is not JSON, send the error message as plain text
    if (error.response && error.response.data) {
      res.status(500).send(error.response.data);
    } else {
      res.status(500).send('Error fetching data from MusicGen API');
    }
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

