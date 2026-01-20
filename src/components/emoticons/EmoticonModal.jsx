import React from 'react';
import './EmoticonModal.css';

const EMOTICONS = [
  '😊', '😎', '🤔', '😴', '😍',
  '😢', '😡', '🤯', '😱', '😤',
  '🤗', '😏', '🙄', '😌', '🤤',
  '😇', '🤓', '😋', '🥳', '😮'
];

const EmoticonModal = ({ isOpen, onClose, onSelectEmoticon }) => {
  if (!isOpen) return null;

  return (
    <div className="emoticon-modal--overlay" onClick={onClose}>
      <div className="emoticon-modal--container" onClick={(e) => e.stopPropagation()}>
        <div className="emoticon-modal--header">
          <h3>Choose Your Mood</h3>
          <button className="emoticon-modal--close" onClick={onClose}>×</button>
        </div>
        <div className="emoticon-modal--grid">
          {EMOTICONS.map((emoticon, index) => (
            <button
              key={index}
              className="emoticon-modal--item"
              onClick={() => {
                onSelectEmoticon(emoticon);
                onClose();
              }}
            >
              {emoticon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmoticonModal;

