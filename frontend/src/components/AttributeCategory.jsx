import React from 'react';
import '../styles/attributeCategory.css';

const AttributeCategory = ({ category, attributes, formData, handleInputChange, index }) => {
  const getCategoryIcon = (cat) => {
    const icons = {
      'Pace': '⚡',
      'Shooting': '🎯',
      'Passing': '🎲',
      'Dribbling': '⭐',
      'Defending': '🛡️',
      'Physical': '💪',
      'Goalkeeping': '🧤',
      'Mental': '🧠'
    };
    return icons[cat] || '⚽';
  };

  return (
    <div className="category-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="category-header">
        <div className="category-icon">{getCategoryIcon(category)}</div>
        <h3 className="category-title">{category}</h3>
        <span className="category-count">{attributes.length}</span>
      </div>

      <div className="attributes-list">
        {attributes.map(attr => {
          const value = formData[attr] || 30;
          const rating = value >= 80 ? 'excellent' : value >= 60 ? 'good' : 'average';
          
          return (
            <div key={attr} className="attribute-row">
              <div className="attribute-info">
                <label className="attribute-label">{attr}</label>
                <span className={`attribute-value ${rating}`}>{value}</span>
              </div>
              
              <input
                type="range"
                min="1"
                max="99"
                value={value}
                onChange={(e) => handleInputChange(attr, e.target.value)}
                className="attribute-slider"
              />
              
              <div className="progress-track">
                <div 
                  className={`progress-fill ${rating}`}
                  style={{ width: `${value}%` }}
                >
                  <div className="progress-glow"></div>
                </div>
              </div>
              
              <span className={`rating-badge ${rating}`}>
                {rating.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttributeCategory;