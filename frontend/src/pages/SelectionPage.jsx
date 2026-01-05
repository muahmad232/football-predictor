import React from 'react';
import { Zap, Target, ChevronLeft } from 'lucide-react';
import '../styles/selection.css';

const SelectionPage = ({ navigateTo, selectPlayerType }) => {
  return (
    <div className="selection-container">
      {/* Hexagon Pattern Background */}
      <div className="hexagon-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="hexagon" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`
          }}></div>
        ))}
      </div>

      <div className="selection-content">
        <button className="back-btn" onClick={() => navigateTo('landing')}>
          <ChevronLeft size={20} />
          BACK
        </button>
        
        <div className="selection-header">
          <h2 className="selection-title">SELECT PLAYER TYPE</h2>
          <div className="title-underline"></div>
          <p className="selection-subtitle">Choose your analysis category</p>
        </div>

        <div className="player-cards-container">
          {/* Outfield Card */}
          <div 
            className="player-card outfield-card"
            onClick={() => selectPlayerType('Outfield')}
          >
            <div className="card-bg-pattern"></div>
            <div className="card-icon-wrapper">
              <Zap size={80} />
            </div>
            <h3 className="card-title">OUTFIELD PLAYER</h3>
            <div className="card-positions">
              <span className="position-badge">LW</span>
              <span className="position-badge">ST</span>
              <span className="position-badge">RW</span>
              <span className="position-badge">LM</span>
              <span className="position-badge">CM</span>
              <span className="position-badge">CAM</span>
              <span className="position-badge">CDM</span>
              <span className="position-badge">RM</span>
              <span className="position-badge">RB</span>
              <span className="position-badge">CB</span>
              <span className="position-badge">LB</span>
              
            </div>
            <p className="card-description">
              Complete analysis for attackers, midfielders, and defenders
            </p>
            <div className="card-tag">MOST POPULAR</div>
            <div className="card-hover-effect"></div>
          </div>

          {/* Goalkeeper Card */}
          <div 
            className="player-card goalkeeper-card"
            onClick={() => selectPlayerType('GK')}
          >
            <div className="card-bg-pattern"></div>
            <div className="card-icon-wrapper">
              <Target size={80} />
            </div>
            <h3 className="card-title">GOALKEEPER</h3>
            <div className="card-positions">
              <span className="position-badge gk-badge">GK</span>
            </div>
            <p className="card-description">
              Specialized analysis for shot-stoppers and sweeper-keepers
            </p>
            <div className="card-tag">SPECIALIST</div>
            <div className="card-hover-effect"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;