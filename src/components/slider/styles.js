const sliderStyle = {
  position: 'relative',
  width: '100%',
  height: 80,
  minHeight: 60,
  padding: '0 10px',
}
  
const railStyle = {
  position: 'absolute',
  width: 'calc(100% - 20px)',
  left: '10px',
  height: 8,
  marginTop: 38,
  borderRadius: 4,
  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  border: '1px solid rgba(255, 201, 53, 0.2)',
  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
}

export { sliderStyle, railStyle }