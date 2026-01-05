// ==================== components/ResultsDisplay.jsx ====================
// REPLACE the existing ResultsDisplay.jsx with this updated version
import React from 'react';
import { TrendingUp, Target, Trophy, Users, RotateCcw } from 'lucide-react';
import CareerPrediction from './CareerPrediction';
import '../styles/results.css';

const ResultsDisplay = ({ predictions, resetApp, playerType, formData }) => {
  return (
    <div className="results-container">
      {/* Scan Line Effect */}
      <div className="scan-lines"></div>

      <div className="results-header">
        <div className="results-icon-pulse">
          <TrendingUp size={50} />
        </div>
        <h2 className="results-title">ANALYSIS COMPLETE</h2>
        <p className="results-subtitle">AI prediction results generated successfully</p>
      </div>

      {/* Main Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card ovr-card">
          <div className="stat-bg-pattern"></div>
          <div className="stat-icon">
            <TrendingUp size={40} />
          </div>
          <div className="stat-label">OVERALL RATING</div>
          <div className="stat-value">{predictions.predicted_ovr}</div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: `${predictions.predicted_ovr}%` }}></div>
          </div>
          <div className="stat-subtext">Out of 99</div>
        </div>

        <div className="stat-card position-card">
          <div className="stat-bg-pattern"></div>
          <div className="stat-icon">
            <Target size={40} />
          </div>
          <div className="stat-label">BEST POSITION</div>
          <div className="stat-value">{predictions.predicted_position}</div>
          <div className="position-visual">
            <div className="position-badge-lg">{predictions.predicted_position}</div>
          </div>
          <div className="stat-subtext">Optimal Role</div>
        </div>

        <div className="stat-card tier-card">
          <div className="stat-bg-pattern"></div>
          <div className="stat-icon">
            <Trophy size={40} />
          </div>
          <div className="stat-label">LEAGUE TIER</div>
          <div className="stat-value">{predictions.predicted_league_tier}</div>
          <div className="tier-stars">
            {predictions.predicted_league_tier === 'Top Tier' && '⭐⭐⭐'}
            {predictions.predicted_league_tier === 'Mid Tier' && '⭐⭐'}
            {predictions.predicted_league_tier === 'Lower Tier' && '⭐'}
          </div>
          <div className="stat-subtext">Competition Level</div>
        </div>
      </div>

      {/* Similar Players Section */}
      <div className="similar-players-section">
        <div className="section-header">
          <Users size={32} className="section-icon" />
          <div>
            <h3 className="section-title">PLAYER DNA MATCHES</h3>
            <p className="section-subtitle">Top 5 statistical similarities</p>
          </div>
        </div>

        <div className="players-grid">
          {predictions.similar_players.map((player, idx) => (
            <div key={idx} className="player-card" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="player-rank">#{idx + 1}</div>
              <div className="player-avatar">
                <div className="avatar-inner">
                  {player.Name ? player.Name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="avatar-ring"></div>
              </div>
              <h4 className="player-name">{player.Name || 'Unknown Player'}</h4>
              <div className="player-stats-row">
                <div className="player-stat ovr-stat">
                  <span className="stat-label-sm">OVR</span>
                  <span className="stat-value-sm">{player.OVR}</span>
                </div>
                <div className="player-stat pos-stat">
                  <span className="stat-label-sm">POS</span>
                  <span className="stat-value-sm">{player.Position}</span>
                </div>
              </div>
              <div className="match-percentage">
                <div className="match-bar">
                  <div className="match-fill" style={{ width: `${100 - idx * 8}%` }}></div>
                </div>
                <span className="match-text">{100 - idx * 8}% Match</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Prediction Component - NEW! */}
      <CareerPrediction 
        predictions={predictions} 
        playerType={playerType}
        formData={formData}
      />

      {/* Reset Button */}
      <button className="reset-btn" onClick={resetApp}>
        <RotateCcw size={20} />
        NEW ANALYSIS
      </button>
    </div>
  );
};

export default ResultsDisplay;