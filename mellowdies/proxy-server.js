const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import CORS middleware

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
    // Log the request being sent to the MusicGen API
    console.log("Sending request to MusicGen API with data:", { description, audioUrl, fn_index });

    // Make a request to the MusicGen API from the backend
    const response = await axios.post('https://facebook-musicgen.hf.space/api/predict/', {
      inputs: [description, audioUrl],
      fn_index: fn_index || 0  // Set the function index to 0 if not provided
    });

    // Log the successful response from the MusicGen API
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
