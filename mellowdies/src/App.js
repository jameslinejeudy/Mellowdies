import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage.js';
import Landingpage from './Landingpage/Landingpage.js';
import Menu from './Landingpage/Menu.js';
import AIMenu from './Landingpage/Ai.js';
import Exportpage from './Exportpage/Exportpage.js';



function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Homepage />} />
        <Route path="/Landingpage" element={<Landingpage />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/AIMenu" element={<AIMenu />} />
        <Route path="/Exportpage" element={<Exportpage />} />
      </Routes>
    </Router> 
 );
}

export default App;

