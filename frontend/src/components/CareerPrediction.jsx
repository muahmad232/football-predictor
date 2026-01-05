// ==================== components/CareerPrediction.jsx ====================
// Create this file: src/components/CareerPrediction.jsx

import React, { useState, useEffect } from 'react';
import { Trophy, Target, Award, Calendar, TrendingUp, Star, Zap, Users } from 'lucide-react';
import '../styles/careerPrediction.css';

const CareerPrediction = ({ predictions, playerType, formData }) => {
  const [showCareer, setShowCareer] = useState(false);
  const [careerStats, setCareerStats] = useState(null);
  const [animating, setAnimating] = useState(false);

  const calculateCareerPrediction = () => {
    const ovr = predictions.predicted_ovr;
    const position = predictions.predicted_position;
    const attributes = formData;

    // Career length based on OVR and Physical attributes
    const stamina = attributes.Stamina || 50;
    const strength = attributes.Strength || 50;
    const longevity = (stamina + strength) / 2;
    
    let careerYears;
    if (ovr >= 85 && longevity >= 70) careerYears = randomBetween(14, 18);
    else if (ovr >= 85) careerYears = randomBetween(12, 16);
    else if (ovr >= 75 && longevity >= 70) careerYears = randomBetween(11, 15);
    else if (ovr >= 75) careerYears = randomBetween(10, 14);
    else if (ovr >= 65) careerYears = randomBetween(8, 12);
    else careerYears = randomBetween(7, 11);

    // Matches per season based on OVR, stamina, and injury risk
    const injuryRisk = 100 - ((stamina + (attributes.Strength || 50)) / 2);
    let matchesPerSeason;
    if (ovr >= 85 && stamina >= 80) matchesPerSeason = randomBetween(42, 50);
    else if (ovr >= 85) matchesPerSeason = randomBetween(38, 46);
    else if (ovr >= 75 && stamina >= 70) matchesPerSeason = randomBetween(35, 44);
    else if (ovr >= 75) matchesPerSeason = randomBetween(32, 40);
    else if (ovr >= 65) matchesPerSeason = randomBetween(28, 38);
    else matchesPerSeason = randomBetween(24, 35);
    
    // Reduce matches for high injury risk
    if (injuryRisk > 40) matchesPerSeason = Math.floor(matchesPerSeason * 0.85);

    const totalMatches = careerYears * matchesPerSeason;

    // Position-based stats
    let goals, assists, cleanSheets;

    if (position === 'GK') {
      // Goalkeepers
      goals = randomBetween(0, 3); // Very rare for GKs to score
      assists = randomBetween(0, 5); // Rare but possible
      
      const gkDiving = attributes['GK Diving'] || 50;
      const gkReflexes = attributes['GK Reflexes'] || 50;
      const gkPositioning = attributes['GK Positioning'] || 50;
      const gkHandling = attributes['GK Handling'] || 50;
      
      const gkQuality = (gkDiving * 0.25 + gkReflexes * 0.30 + gkPositioning * 0.25 + gkHandling * 0.20) / 100;
      
      let cleanSheetsPerSeason;
      if (ovr >= 85) {
        cleanSheetsPerSeason = 12 + (gkQuality * 14); // 12-26 clean sheets/season
      } else if (ovr >= 80) {
        cleanSheetsPerSeason = 10 + (gkQuality * 12); // 10-22 clean sheets/season
      } else if (ovr >= 75) {
        cleanSheetsPerSeason = 8 + (gkQuality * 10); // 8-18 clean sheets/season
      } else if (ovr >= 70) {
        cleanSheetsPerSeason = 6 + (gkQuality * 9); // 6-15 clean sheets/season
      } else {
        cleanSheetsPerSeason = 4 + (gkQuality * 7); // 4-11 clean sheets/season
      }
      
      cleanSheets = Math.round(cleanSheetsPerSeason * careerYears);
      
    } else if (position === 'Striker') {
      // Strikers - Goal calculation based on key attacking attributes
      const finishing = attributes.Finishing || 50;
      const positioning = attributes.Positioning || 50;
      const shotPower = attributes['Shot Power'] || 50;
      const composure = attributes.Composure || 50;
      
      // Calculate attacking efficiency (0-1 scale)
      const attackingQuality = (finishing * 0.35 + positioning * 0.30 + shotPower * 0.20 + composure * 0.15) / 100;
      
      // Base goals per season calculation
      let goalsPerSeason;
      if (ovr >= 85 && finishing >= 85) {
        goalsPerSeason = 25 + (attackingQuality * 20); // 25-45 goals/season
      } else if (ovr >= 80 && finishing >= 80) {
        goalsPerSeason = 18 + (attackingQuality * 15); // 18-33 goals/season
      } else if (ovr >= 75 && finishing >= 70) {
        goalsPerSeason = 13 + (attackingQuality * 12); // 13-25 goals/season
      } else if (ovr >= 70) {
        goalsPerSeason = 9 + (attackingQuality * 10); // 9-19 goals/season
      } else {
        goalsPerSeason = 6 + (attackingQuality * 8); // 6-14 goals/season
      }
      
      // Scale based on match availability (but not linearly - elite players are efficient)
      const matchScale = 0.75 + (matchesPerSeason / 45) * 0.25; // Range: 0.75-1.0
      goals = Math.round(goalsPerSeason * careerYears * matchScale);
      assists = Math.round(goals * randomBetween(20, 35) / 100); // 20-35% of goals as assists
      cleanSheets = 0;
      
    } else if (position === 'Winger') {
      // Wingers - Balanced goals and assists
      const dribbling = attributes.Dribbling || 50;
      const crossing = attributes.Crossing || 50;
      const finishing = attributes.Finishing || 50;
      const pace = ((attributes.Acceleration || 50) + (attributes['Sprint Speed'] || 50)) / 2;
      
      const attackingQuality = (dribbling * 0.25 + crossing * 0.25 + finishing * 0.25 + pace * 0.25) / 100;
      
      let goalsPerSeason, assistsPerSeason;
      if (ovr >= 85) {
        goalsPerSeason = 15 + (attackingQuality * 15); // 15-30 goals/season
        assistsPerSeason = 12 + (attackingQuality * 13); // 12-25 assists/season
      } else if (ovr >= 80) {
        goalsPerSeason = 11 + (attackingQuality * 11); // 11-22 goals/season
        assistsPerSeason = 9 + (attackingQuality * 11); // 9-20 assists/season
      } else if (ovr >= 75) {
        goalsPerSeason = 8 + (attackingQuality * 9); // 8-17 goals/season
        assistsPerSeason = 7 + (attackingQuality * 9); // 7-16 assists/season
      } else if (ovr >= 70) {
        goalsPerSeason = 6 + (attackingQuality * 7); // 6-13 goals/season
        assistsPerSeason = 5 + (attackingQuality * 7); // 5-12 assists/season
      } else {
        goalsPerSeason = 4 + (attackingQuality * 5); // 4-9 goals/season
        assistsPerSeason = 3 + (attackingQuality * 6); // 3-9 assists/season
      }
      
      const matchScale = 0.75 + (matchesPerSeason / 45) * 0.25;
      goals = Math.round(goalsPerSeason * careerYears * matchScale);
      assists = Math.round(assistsPerSeason * careerYears * matchScale);
      cleanSheets = 0;
      
    } else if (position === 'Midfielder') {
      // Midfielders - More assists than goals, depends on type
      const shortPassing = attributes['Short Passing'] || 50;
      const longPassing = attributes['Long Passing'] || 50;
      const vision = attributes.Vision || 50;
      const longShots = attributes['Long Shots'] || 50;
      const finishing = attributes.Finishing || 50;
      const positioning = attributes.Positioning || 50;
      
      const playmaking = (shortPassing * 0.3 + longPassing * 0.25 + vision * 0.35 + (attributes['Ball Control'] || 50) * 0.1) / 100;
      const goalThreat = (longShots * 0.4 + finishing * 0.4 + positioning * 0.2) / 100;
      
      let goalsPerSeason, assistsPerSeason;
      if (ovr >= 85) {
        goalsPerSeason = 8 + (goalThreat * 12); // 8-20 goals/season
        assistsPerSeason = 12 + (playmaking * 16); // 12-28 assists/season
      } else if (ovr >= 80) {
        goalsPerSeason = 6 + (goalThreat * 9); // 6-15 goals/season
        assistsPerSeason = 9 + (playmaking * 13); // 9-22 assists/season
      } else if (ovr >= 75) {
        goalsPerSeason = 5 + (goalThreat * 7); // 5-12 goals/season
        assistsPerSeason = 7 + (playmaking * 11); // 7-18 assists/season
      } else if (ovr >= 70) {
        goalsPerSeason = 4 + (goalThreat * 6); // 4-10 goals/season
        assistsPerSeason = 5 + (playmaking * 9); // 5-14 assists/season
      } else {
        goalsPerSeason = 3 + (goalThreat * 5); // 3-8 goals/season
        assistsPerSeason = 4 + (playmaking * 7); // 4-11 assists/season
      }
      
      const matchScale = 0.75 + (matchesPerSeason / 45) * 0.25;
      goals = Math.round(goalsPerSeason * careerYears * matchScale);
      assists = Math.round(assistsPerSeason * careerYears * matchScale);
      cleanSheets = 0;
      
    } else if (position === 'Full-back') {
      // Full-backs - Defensive but some assists
      const crossing = attributes.Crossing || 50;
      const defAwareness = attributes['Def Awareness'] || 50;
      const stamina = attributes.Stamina || 50;
      
      const attackingContribution = (crossing * 0.5 + stamina * 0.3 + (attributes['Short Passing'] || 50) * 0.2) / 100;
      const defensiveQuality = (defAwareness * 0.4 + (attributes['Standing Tackle'] || 50) * 0.35 + (attributes.Interceptions || 50) * 0.25) / 100;
      
      let goalsPerSeason, assistsPerSeason, cleanSheetsPerSeason;
      if (ovr >= 85) {
        goalsPerSeason = 2 + (attackingContribution * 3); // 2-5 goals/season
        assistsPerSeason = 5 + (attackingContribution * 7); // 5-12 assists/season
        cleanSheetsPerSeason = 8 + (defensiveQuality * 10); // 8-18 clean sheets/season
      } else if (ovr >= 80) {
        goalsPerSeason = 1.5 + (attackingContribution * 2.5); // 1.5-4 goals/season
        assistsPerSeason = 4 + (attackingContribution * 6); // 4-10 assists/season
        cleanSheetsPerSeason = 6 + (defensiveQuality * 9); // 6-15 clean sheets/season
      } else if (ovr >= 75) {
        goalsPerSeason = 1 + (attackingContribution * 2); // 1-3 goals/season
        assistsPerSeason = 3 + (attackingContribution * 5); // 3-8 assists/season
        cleanSheetsPerSeason = 5 + (defensiveQuality * 8); // 5-13 clean sheets/season
      } else if (ovr >= 70) {
        goalsPerSeason = 0.7 + (attackingContribution * 1.5); // 0.7-2.2 goals/season
        assistsPerSeason = 2 + (attackingContribution * 4); // 2-6 assists/season
        cleanSheetsPerSeason = 4 + (defensiveQuality * 7); // 4-11 clean sheets/season
      } else {
        goalsPerSeason = 0.5 + (attackingContribution * 1); // 0.5-1.5 goals/season
        assistsPerSeason = 1.5 + (attackingContribution * 3); // 1.5-4.5 assists/season
        cleanSheetsPerSeason = 3 + (defensiveQuality * 6); // 3-9 clean sheets/season
      }
      
      goals = Math.round(goalsPerSeason * careerYears);
      assists = Math.round(assistsPerSeason * careerYears);
      cleanSheets = Math.round(cleanSheetsPerSeason * careerYears);
      
    } else if (position === 'Center-back') {
      // Center-backs - Mainly defensive
      const heading = attributes['Heading Accuracy'] || 50;
      const defAwareness = attributes['Def Awareness'] || 50;
      const jumping = attributes.Jumping || 50;
      
      const aerialThreat = (heading * 0.6 + jumping * 0.3 + (attributes.Strength || 50) * 0.1) / 100;
      const defensiveQuality = (defAwareness * 0.35 + (attributes['Standing Tackle'] || 50) * 0.35 + (attributes.Interceptions || 50) * 0.3) / 100;
      
      let goalsPerSeason, assistsPerSeason, cleanSheetsPerSeason;
      if (ovr >= 85) {
        goalsPerSeason = 2 + (aerialThreat * 4); // 2-6 goals/season from set pieces
        assistsPerSeason = 1 + (aerialThreat * 2); // 1-3 assists/season
        cleanSheetsPerSeason = 10 + (defensiveQuality * 12); // 10-22 clean sheets/season
      } else if (ovr >= 80) {
        goalsPerSeason = 1.5 + (aerialThreat * 3); // 1.5-4.5 goals/season
        assistsPerSeason = 0.8 + (aerialThreat * 1.5); // 0.8-2.3 assists/season
        cleanSheetsPerSeason = 8 + (defensiveQuality * 10); // 8-18 clean sheets/season
      } else if (ovr >= 75) {
        goalsPerSeason = 1 + (aerialThreat * 2.5); // 1-3.5 goals/season
        assistsPerSeason = 0.6 + (aerialThreat * 1.2); // 0.6-1.8 assists/season
        cleanSheetsPerSeason = 6 + (defensiveQuality * 9); // 6-15 clean sheets/season
      } else if (ovr >= 70) {
        goalsPerSeason = 0.8 + (aerialThreat * 2); // 0.8-2.8 goals/season
        assistsPerSeason = 0.5 + (aerialThreat * 1); // 0.5-1.5 assists/season
        cleanSheetsPerSeason = 5 + (defensiveQuality * 8); // 5-13 clean sheets/season
      } else {
        goalsPerSeason = 0.5 + (aerialThreat * 1.5); // 0.5-2 goals/season
        assistsPerSeason = 0.3 + (aerialThreat * 0.8); // 0.3-1.1 assists/season
        cleanSheetsPerSeason = 3 + (defensiveQuality * 7); // 3-10 clean sheets/season
      }
      
      goals = Math.round(goalsPerSeason * careerYears);
      assists = Math.round(assistsPerSeason * careerYears);
      cleanSheets = Math.round(cleanSheetsPerSeason * careerYears);
    } else {
      // Default for any other position
      goals = randomBetween(50, 150);
      assists = randomBetween(40, 120);
      cleanSheets = 0;
    }

    // Trophies based on OVR and League Tier - more realistic and conservative
    const tier = predictions.predicted_league_tier;
    let leagueWins, championsLeagueWins, worldCupWins, ballonDors;
    
    // Ballon d'Or is extremely rare (only ~1 winner per year, usually attackers)
    const isAttackingPlayer = ['Striker', 'Winger', 'Midfielder'].includes(position);

    if (ovr >= 92 && tier === 'Top Tier' && isAttackingPlayer) {
      leagueWins = randomBetween(6, 10);
      championsLeagueWins = randomBetween(2, 4);
      worldCupWins = Math.random() > 0.5 ? 1 : 0; // 50% chance
      ballonDors = randomBetween(1, 3);
    } else if (ovr >= 88 && tier === 'Top Tier') {
      leagueWins = randomBetween(4, 8);
      championsLeagueWins = randomBetween(1, 3);
      worldCupWins = Math.random() > 0.7 ? 1 : 0; // 30% chance
      ballonDors = isAttackingPlayer && Math.random() > 0.7 ? 1 : 0;
    } else if (ovr >= 85 && tier === 'Top Tier') {
      leagueWins = randomBetween(3, 6);
      championsLeagueWins = randomBetween(1, 2);
      worldCupWins = Math.random() > 0.85 ? 1 : 0; // 15% chance
      ballonDors = 0;
    } else if (ovr >= 80 && tier === 'Top Tier') {
      leagueWins = randomBetween(2, 5);
      championsLeagueWins = Math.random() > 0.6 ? randomBetween(1, 2) : 0;
      worldCupWins = 0;
      ballonDors = 0;
    } else if (ovr >= 80) {
      leagueWins = randomBetween(2, 4);
      championsLeagueWins = Math.random() > 0.7 ? 1 : 0;
      worldCupWins = 0;
      ballonDors = 0;
    } else if (ovr >= 75) {
      leagueWins = randomBetween(1, 3);
      championsLeagueWins = Math.random() > 0.85 ? 1 : 0;
      worldCupWins = 0;
      ballonDors = 0;
    } else if (ovr >= 70) {
      leagueWins = randomBetween(0, 2);
      championsLeagueWins = 0;
      worldCupWins = 0;
      ballonDors = 0;
    } else {
      leagueWins = randomBetween(0, 1);
      championsLeagueWins = 0;
      worldCupWins = 0;
      ballonDors = 0;
    }

    return {
      careerYears,
      totalMatches,
      goals,
      assists,
      cleanSheets: position === 'GK' || position === 'Center-back' || position === 'Full-back' ? cleanSheets : null,
      leagueWins,
      championsLeagueWins,
      worldCupWins,
      ballonDors
    };
  };

  const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handlePredictCareer = () => {
    setAnimating(true);
    setTimeout(() => {
      const stats = calculateCareerPrediction();
      setCareerStats(stats);
      setShowCareer(true);
      setAnimating(false);
    }, 2000);
  };

  const CounterAnimation = ({ endValue, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!showCareer) return;
      
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * endValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [showCareer, endValue, duration]);

    return (
      <span className="counter-value">
        {prefix}{count}{suffix}
      </span>
    );
  };

  if (!showCareer && !animating) {
    return (
      <div className="career-prediction-trigger">
        <button className="predict-career-btn" onClick={handlePredictCareer}>
          <Zap size={24} />
          PREDICT CAREER TRAJECTORY
          <div className="btn-lightning"></div>
        </button>
        <p className="career-trigger-subtitle">
          AI-powered lifetime achievement forecast based on current attributes
        </p>
      </div>
    );
  }

  if (animating) {
    return (
      <div className="career-loading">
        <div className="loading-orb">
          <div className="orb-inner"></div>
          <div className="orb-ring ring-1"></div>
          <div className="orb-ring ring-2"></div>
          <div className="orb-ring ring-3"></div>
        </div>
        <h3 className="loading-text">CALCULATING CAREER TRAJECTORY...</h3>
        <div className="loading-bars">
          <div className="bar" style={{ animationDelay: '0s' }}></div>
          <div className="bar" style={{ animationDelay: '0.1s' }}></div>
          <div className="bar" style={{ animationDelay: '0.2s' }}></div>
          <div className="bar" style={{ animationDelay: '0.3s' }}></div>
          <div className="bar" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="career-prediction-container">
      <div className="career-header">
        <div className="header-icon">
          <Calendar size={50} />
        </div>
        <h2 className="career-title">CAREER PROJECTION</h2>
        <p className="career-subtitle">AI-generated lifetime statistics and achievements</p>
      </div>

      {/* Career Overview */}
      <div className="career-overview">
        <div className="overview-card">
          <Calendar className="overview-icon" size={40} />
          <div className="overview-label">CAREER SPAN</div>
          <div className="overview-value">
            <CounterAnimation endValue={careerStats.careerYears} suffix=" Years" />
          </div>
        </div>

        <div className="overview-card">
          <Users className="overview-icon" size={40} />
          <div className="overview-label">TOTAL MATCHES</div>
          <div className="overview-value">
            <CounterAnimation endValue={careerStats.totalMatches} />
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="performance-section">
        <h3 className="section-title">
          <TrendingUp size={28} />
          PERFORMANCE STATISTICS
        </h3>
        
        <div className="stats-grid-career">
          <div className="stat-card-career goals-card">
            <div className="stat-icon-wrapper">
              <Target size={36} />
            </div>
            <div className="stat-label">GOALS</div>
            <div className="stat-value-career">
              <CounterAnimation endValue={careerStats.goals} />
            </div>
            <div className="stat-bar-career">
              <div className="stat-fill goals-fill" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="stat-card-career assists-card">
            <div className="stat-icon-wrapper">
              <Users size={36} />
            </div>
            <div className="stat-label">ASSISTS</div>
            <div className="stat-value-career">
              <CounterAnimation endValue={careerStats.assists} />
            </div>
            <div className="stat-bar-career">
              <div className="stat-fill assists-fill" style={{ width: '100%' }}></div>
            </div>
          </div>

          {careerStats.cleanSheets !== null && (
            <div className="stat-card-career cleansheets-card">
              <div className="stat-icon-wrapper">
                <Award size={36} />
              </div>
              <div className="stat-label">CLEAN SHEETS</div>
              <div className="stat-value-career">
                <CounterAnimation endValue={careerStats.cleanSheets} />
              </div>
              <div className="stat-bar-career">
                <div className="stat-fill cleansheets-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trophies Section */}
      <div className="trophies-section">
        <h3 className="section-title">
          <Trophy size={28} />
          TROPHY CABINET
        </h3>

        <div className="trophies-grid">
          <div className="trophy-card ballon">
            <div className="trophy-icon">
              <Star size={50} />
            </div>
            <div className="trophy-count">
              <CounterAnimation endValue={careerStats.ballonDors} />
            </div>
            <div className="trophy-label">Ballon d'Or</div>
            <div className="trophy-rarity">
              {careerStats.ballonDors >= 3 ? 'LEGENDARY' : 
               careerStats.ballonDors >= 1 ? 'ELITE' : 'N/A'}
            </div>
          </div>

          <div className="trophy-card league">
            <div className="trophy-icon">
              <Trophy size={50} />
            </div>
            <div className="trophy-count">
              <CounterAnimation endValue={careerStats.leagueWins} />
            </div>
            <div className="trophy-label">League Titles</div>
            <div className="trophy-rarity">
              {careerStats.leagueWins >= 8 ? 'LEGENDARY' : 
               careerStats.leagueWins >= 5 ? 'ELITE' : 
               careerStats.leagueWins >= 2 ? 'GOOD' : 'AVERAGE'}
            </div>
          </div>

          <div className="trophy-card ucl">
            <div className="trophy-icon">
              <Award size={50} />
            </div>
            <div className="trophy-count">
              <CounterAnimation endValue={careerStats.championsLeagueWins} />
            </div>
            <div className="trophy-label">Champions League</div>
            <div className="trophy-rarity">
              {careerStats.championsLeagueWins >= 3 ? 'LEGENDARY' : 
               careerStats.championsLeagueWins >= 2 ? 'ELITE' : 
               careerStats.championsLeagueWins >= 1 ? 'GOOD' : 'N/A'}
            </div>
          </div>

          <div className="trophy-card worldcup">
            <div className="trophy-icon">
              <Trophy size={50} />
            </div>
            <div className="trophy-count">
              <CounterAnimation endValue={careerStats.worldCupWins} />
            </div>
            <div className="trophy-label">World Cup</div>
            <div className="trophy-rarity">
              {careerStats.worldCupWins >= 2 ? 'LEGENDARY' : 
               careerStats.worldCupWins >= 1 ? 'ELITE' : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Legacy Rating */}
      <div className="legacy-section">
        <h3 className="legacy-title">LEGACY RATING</h3>
        <div className="legacy-bar">
          <div className="legacy-fill" style={{
            width: `${Math.min(100, (careerStats.ballonDors * 15 + careerStats.leagueWins * 5 + 
                    careerStats.championsLeagueWins * 10 + careerStats.worldCupWins * 20))}%`
          }}></div>
        </div>
        <p className="legacy-text">
          {predictions.predicted_ovr >= 90 ? '🌟 ALL-TIME GREAT - Generational Talent' :
           predictions.predicted_ovr >= 85 ? '⭐ WORLD CLASS - Elite Player' :
           predictions.predicted_ovr >= 80 ? '✨ TOP PLAYER - Consistent Performer' :
           predictions.predicted_ovr >= 75 ? '💫 SOLID PLAYER - Reliable Professional' :
           '⚽ PROFESSIONAL - Decent Career'}
        </p>
      </div>
    </div>
  );
};

export default CareerPrediction;