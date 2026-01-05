// ==================== pages/LandingPage.jsx ====================
// REPLACE your existing LandingPage.jsx with this updated version
import React from 'react';
import { TrendingUp, Users, Trophy, Target, Activity, Zap, Calendar, Award } from 'lucide-react';
import '../styles/landing.css';

const LandingPage = ({ navigateTo }) => {
  return (
    <div className="landing-container">
      {/* Animated Background */}
      <div className="football-field-bg">
        <div className="field-line field-line-1"></div>
        <div className="field-line field-line-2"></div>
        <div className="field-line field-line-3"></div>
        <div className="center-circle"></div>
      </div>

      {/* Floating Football Elements */}
      <div className="floating-footballs">
        <div className="football football-1">⚽</div>
        <div className="football football-2">⚽</div>
        <div className="football football-3">⚽</div>
      </div>

      <div className="hero-content">
        {/* Logo with Stadium Effect */}
        <div className="logo-stadium">
          <Activity size={70} className="logo-icon" />
          <div className="stadium-lights">
            <div className="light light-1"></div>
            <div className="light light-2"></div>
            <div className="light light-3"></div>
            <div className="light light-4"></div>
          </div>
        </div>
        
        <h1 className="hero-title">
          <span className="title-line">FOOTBALL PLAYER</span>
          <span className="title-accent">AI PREDICTOR</span>
        </h1>
        
        <p className="hero-subtitle">
          Next-gen AI technology meets football analytics. Predict ratings, positions, 
          career trajectories and discover player DNA with machine learning precision.
        </p>

        {/* Feature Cards Grid - Updated with 5 cards */}
        <div className="features-grid-landing">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <TrendingUp size={36} />
            </div>
            <h3>OVR Prediction</h3>
            <p>Neural network-powered rating analysis</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Target size={36} />
            </div>
            <h3>Position AI</h3>
            <p>Optimal role identification system</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Trophy size={36} />
            </div>
            <h3>League Tier</h3>
            <p>Competitive level assessment</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={36} />
            </div>
            <h3>Player DNA</h3>
            <p>Find statistical twins instantly</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Calendar size={36} />
            </div>
            <h3>Career Trajectory</h3>
            <p>Lifetime achievement forecast</p>
            
          </div>
        </div>

        {/* Enhanced Feature Showcase Section */}
        <div className="feature-showcase">
          <div className="showcase-header">
            <h2 className="showcase-title">
              <Award size={32} className="showcase-icon" />
              Complete Career Analysis
            </h2>
            <p className="showcase-subtitle">Predict your player's entire journey from debut to retirement</p>
          </div>

          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="showcase-icon-box">
                <Calendar size={28} />
              </div>
              <div className="showcase-content">
                <h4>Career Duration</h4>
                <p>Total years & matches played</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon-box">
                <Target size={28} />
              </div>
              <div className="showcase-content">
                <h4>Performance Stats</h4>
                <p>Goals, assists & clean sheets</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon-box">
                <Trophy size={28} />
              </div>
              <div className="showcase-content">
                <h4>Trophy Cabinet</h4>
                <p>League, UCL & World Cup wins</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon-box">
                <Award size={28} />
              </div>
              <div className="showcase-content">
                <h4>Ballon d'Or</h4>
                <p>Individual accolades predicted</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          className="cta-button"
          onClick={() => navigateTo('selection')}
        >
          <Zap size={24} />
          START ANALYSIS
          <div className="button-glow"></div>
        </button>

        {/* Stats Bar - Updated */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">99</span>
            <span className="stat-label">MAX RATING</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">12</span>
            <span className="stat-label">POSITIONS</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">AI</span>
            <span className="stat-label">POWERED</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">20</span>
            <span className="stat-label">YEAR CAREER</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;