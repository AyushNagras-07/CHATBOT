import Spline from '@splinetool/react-spline';

export default function anime() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <Spline
        scene="https://prod.spline.design/wwyRokpGwIi74VFA/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
}
