// ==================== pages/FormPage.jsx ====================
// REPLACE the existing FormPage.jsx with this updated version
import React, { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Zap } from 'lucide-react';
import AttributeCategory from '../components/AttributeCategory';
import ResultsDisplay from '../components/ResultsDisplay';
import { outfieldAttributes, gkAttributes } from '../data/attributes';
import { API_ENDPOINTS } from '../config/api';
import '../styles/form.css';

const FormPage = ({ 
  playerType, 
  navigateTo, 
  resetApp,
  formData,
  setFormData,
  predictions,
  setPredictions
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const attributes = playerType === 'GK' ? gkAttributes : outfieldAttributes;

  // Initialize all attributes to 30
  useEffect(() => {
    const allAttrs = Object.values(attributes).flat();
    const initialData = {};
    allAttrs.forEach(attr => {
      initialData[attr] = 30;
    });
    setFormData(initialData);
  }, [playerType]);

  const handleInputChange = (attr, value) => {
    const numValue = parseInt(value) || 1;
    setFormData(prev => ({
      ...prev,
      [attr]: Math.min(99, Math.max(1, numValue))
    }));
  };

  const calculateFaceStats = (data) => {
    return {
      PAC: Math.round((data['Acceleration'] + data['Sprint Speed']) / 2),
      SHO: Math.round((data['Positioning'] + data['Finishing'] + data['Shot Power'] + 
            data['Long Shots'] + data['Volleys'] + data['Penalties']) / 6),
      PAS: Math.round((data['Vision'] + data['Crossing'] + data['Free Kick Accuracy'] + 
            data['Short Passing'] + data['Long Passing'] + data['Curve']) / 6),
      DRI: Math.round((data['Agility'] + data['Balance'] + data['Reactions'] + 
            data['Ball Control'] + data['Dribbling'] + data['Composure']) / 6),
      DEF: Math.round((data['Interceptions'] + data['Heading Accuracy'] + data['Def Awareness'] + 
            data['Standing Tackle'] + data['Sliding Tackle']) / 5),
      PHY: Math.round((data['Jumping'] + data['Stamina'] + data['Strength'] + data['Aggression']) / 4)
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setPredictions(null);

    try {
      const faceStats = calculateFaceStats(formData);
      const payload = {
        playerType,
        ...formData,
        ...faceStats
      };

      const endpoint = playerType === 'GK' ? API_ENDPOINTS.GOALKEEPER : API_ENDPOINTS.OUTFIELD;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to get prediction');

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  if (predictions) {
    return (
      <ResultsDisplay 
        predictions={predictions} 
        resetApp={resetApp} 
        playerType={playerType}
        formData={formData}
      />
    );
  }

  return (
    <div className="form-container">
      {/* Digital Rain Effect */}
      <div className="digital-rain">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="rain-column" style={{
            left: `${i * 3.33}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}>
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      <div className="form-header">
        <button className="back-btn" onClick={() => navigateTo('selection')}>
          <ChevronLeft size={20} />
          BACK
        </button>
        <div className="form-title-section">
          <h2 className="form-title">
            {playerType === 'GK' ? '🧤 GOALKEEPER' : '⚽ OUTFIELD PLAYER'}
            <span className="title-chip">ANALYSIS</span>
          </h2>
          <p className="form-subtitle">Configure player attributes • All start at 30</p>
        </div>
      </div>

      <div className="form-content">
        <div className="categories-grid">
          {Object.entries(attributes).map(([category, attrs], idx) => (
            <AttributeCategory
              key={category}
              category={category}
              attributes={attrs}
              formData={formData}
              handleInputChange={handleInputChange}
              index={idx}
            />
          ))}
        </div>

        {error && (
          <div className="error-alert">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <strong>ERROR</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="submit-section">
          <button
            className={`submit-btn ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                ANALYZING DATA...
              </>
            ) : (
              <>
                <Zap size={24} />
                GENERATE PREDICTION
                <div className="btn-energy"></div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPage;