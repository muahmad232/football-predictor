import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import SelectionPage from './pages/SelectionPage';
import FormPage from './pages/FormPage';
import './styles/globalStyles.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [playerType, setPlayerType] = useState('');
  const [formData, setFormData] = useState({});
  const [predictions, setPredictions] = useState(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const selectPlayerType = (type) => {
    setPlayerType(type);
    setCurrentPage('form');
  };

  const resetApp = () => {
    setFormData({});
    setPredictions(null);
    setPlayerType('');
    setCurrentPage('landing');
  };

  return (
    <div className="app-container">
      {currentPage === 'landing' && (
        <LandingPage navigateTo={navigateTo} />
      )}
      {currentPage === 'selection' && (
        <SelectionPage 
          navigateTo={navigateTo} 
          selectPlayerType={selectPlayerType}
        />
      )}
      {currentPage === 'form' && (
        <FormPage
          playerType={playerType}
          navigateTo={navigateTo}
          resetApp={resetApp}
          formData={formData}
          setFormData={setFormData}
          predictions={predictions}
          setPredictions={setPredictions}
        />
      )}
    </div>
  );
};

export default App;