// index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importing the CSS file
import App from './App'; // Importing the main App component

// Create a root element and render the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
