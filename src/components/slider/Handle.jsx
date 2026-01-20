import React from 'react';

function Handle({
  handle: { id, value, percent },
  getHandleProps
}) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: 'absolute',
        marginLeft: -18,
        marginTop: 20,
        zIndex: 3,
        width: 36,
        height: 36,
        border: '3px solid rgba(255, 201, 53, 0.8)',
        textAlign: 'center',
        cursor: 'grab',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ffc935 0%, #ffb800 50%, #ffd700 100%)',
        boxShadow: '0 4px 12px rgba(255, 201, 53, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...getHandleProps(id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.15)';
        e.currentTarget.style.cursor = 'grabbing';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 201, 53, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.cursor = 'grab';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 201, 53, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)';
      }}
    >
      <div style={{ 
        display: 'flex', 
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)', 
        justifyContent: 'center', 
        alignItems: 'center',
        fontFamily: 'Roboto', 
        fontSize: 12,
        fontWeight: 700,
        color: '#1a1a1a',
        marginTop: 0,
        width: '100%',
        height: '100%'
      }} >
        {value}
      </div>
    </div>

  )
}

export default Handle;