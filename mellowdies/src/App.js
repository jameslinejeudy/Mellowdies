import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage.js';
import Landingpage from './Landingpage/Landingpage.js';
import Menu from './Landingpage/Menu.js';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Homepage />} />
        <Route path="/Landingpage" element={<Landingpage />} />
        <Route path="/Menu" element={<Menu />} />

      </Routes>
    </Router> 
 );
}

export default App;

