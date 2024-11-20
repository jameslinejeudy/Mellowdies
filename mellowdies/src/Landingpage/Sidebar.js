import React, { useState } from 'react';
import menubutton from '../images/icons/menubutton.png';
import sparkless from '../images/icons/drawstar.png';
import Menu from './Menu.js';
import AIMenu from './Ai.js';

const sidebarContainerStyle = {
    width: '25%',
    height: '100%',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center', 
    flexDirection: 'column',  
    border: '2px solid #ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',  
    fontFamily: "'Concert One', cursive",
    textAlign: 'left',
    fontSize: '1.2rem',
    boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.6)',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '1001',
    paddingTop: '5%',
    transition: 'width 0.3s ease',
};

const expandedSidebarStyle = {
  ...sidebarContainerStyle,
  width: '25%', 
};

const collapsedSidebarStyle = {
  ...sidebarContainerStyle,
  width: '0%',
};

const buttonStyle = {
    padding: '8px 16px',  
    borderRadius: '30px',  
    border: '2px solid #ffffff',  
    backgroundColor: 'rgba(255, 255, 255, 0.5)',  
    color: '#000',  
    fontFamily: "'Concert One', cursive",  
    cursor: 'pointer',
    width: '90%',  
    marginBottom: '10px',  
    textAlign: 'center',
    fontSize: '1rem',  
    boxShadow: '2px 2px 4px white, -2px -2px 4px white',  
    alignSelf: 'center',  
    flexDirection: 'row',  
};

const menubuttonStyle = {
    display: 'flex',
    flexDirection: 'row',  
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: '1%',  
    left: '0.5%',
    zIndex: '1001',  
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',  
    border: 'none',
    padding: '0',
    width: 'auto',
    height: 'auto',
};

const headingStyle = {
  display: 'flex',
  flexDirection: 'row',  
  alignItems: 'center',
  justifyContent: 'center',
    fontSize: '1.5rem',  
    color: '#000000',  
    margin: 0,  
    padding: 0,  
    fontFamily: 'Concert One',  
    marginLeft: '10px',
    marginTop: '-2px',
    height: 'auto',
};

function Sidebar({ waveData, fileLoaded }) {
  const [isMenuVisible, setMenuVisible] = useState(null);
  const [isFileWarningVisible, setFileWarningVisible] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleMenu = (menu) => {
    if (menu === 'mixerMenu' && !fileLoaded) {
      // Show warning and prevent menu from opening
      setFileWarningVisible(true);
    } else {
      // Open the menu if conditions are met
      setMenuVisible(isMenuVisible === menu ? null : menu);
      setFileWarningVisible(false);
    }
  };

  const handleBack = () => {
    setMenuVisible(null);
    setFileWarningVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div style={isSidebarExpanded ? expandedSidebarStyle : collapsedSidebarStyle}>
      <button style={menubuttonStyle} onClick={() => toggleSidebar()}>
        <img src={menubutton} alt="Menu Button" style={{ width: '33px', height: 'auto' }} />
        <h1 style={headingStyle}>MELLOWDIES</h1>
      </button>

      {isSidebarExpanded && (
        <>
          {isMenuVisible === null && (
            <>
              <button style={buttonStyle} onClick={() => toggleMenu('aiSuggestionMenu')}>
                <h1 style={headingStyle}>AI EDITOR</h1>
              </button>
              <button style={buttonStyle} onClick={() => toggleMenu('mixerMenu')}>
                <h1 style={headingStyle}>MIXER</h1>
              </button>
            </>
          )}
          {isMenuVisible === 'mainMenu' && <Menu />}
          {isMenuVisible === 'aiSuggestionMenu' && (
            <AIMenu handleBack={handleBack} waveData={waveData} />
          )}
          {isMenuVisible === 'mixerMenu' && <Menu handleBack={handleBack} waveData={waveData} />}
          {isFileWarningVisible && (
            <div
              style={{
                color: 'red',
                textAlign: 'center',
                marginTop: '10px',
                fontSize: '1rem',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              <p>Warning: Please load a file before accessing the Mixer!</p>
              <button
                style={{
                  marginTop: '5px',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: 'red',
                  color: 'white',
                  cursor: 'pointer',
                }}
                onClick={() => setFileWarningVisible(false)}
              >
                Dismiss
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Sidebar;
