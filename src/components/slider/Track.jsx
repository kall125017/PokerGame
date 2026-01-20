import React from 'react';

function Track ({ source, target, getTrackProps }) {
  return(
    <div
    style={{
        position: 'absolute',
        height: 8,
        zIndex: 2,
        marginTop: 38,
        background: 'linear-gradient(90deg, rgba(255, 201, 53, 0.6) 0%, rgba(255, 184, 0, 0.8) 100%)',
        borderRadius: 4,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
        boxShadow: '0 2px 6px rgba(255, 201, 53, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
        transition: 'all 0.2s ease',
    }}
    {...getTrackProps()}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255, 201, 53, 0.8) 0%, rgba(255, 184, 0, 1) 100%)';
      e.currentTarget.style.boxShadow = '0 3px 8px rgba(255, 201, 53, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255, 201, 53, 0.6) 0%, rgba(255, 184, 0, 0.8) 100%)';
      e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 201, 53, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)';
    }}
    />
  )
}
  
export default Track;