import React from 'react';
import './SocialSection.css';

const SocialSection = () => {
  return (
    <div className="social-section">
      <div className="social-section--content">
        <div className="social-section--left">
          <h3 className="social-section--title">BetfuzPokerDemo</h3>
        </div>
        <div className="social-section--center">
          <div className="social-section--online">
            <span className="social-section--online-indicator"></span>
            <span>Online: 12</span>
          </div>
        </div>
        <div className="social-section--right">
          <button className="social-section--button">Chat</button>
          <button className="social-section--button">Friends</button>
          <button className="social-section--button">Settings</button>
        </div>
      </div>
    </div>
  );
};

export default SocialSection;

