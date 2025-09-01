import React from 'react';

const particleCount = 50; // Adjust for density

const ParticleBackground: React.FC = () => {
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`, // Start at random vertical positions
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      backgroundColor: 'rgba(0, 122, 255, 0.2)', // Subtle primary blue
      borderRadius: '50%',
      animationName: 'floatUp',
      animationDuration: `${Math.random() * 20 + 10}s`,
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      animationDelay: `-${Math.random() * 30}s`, // Start animations at different times
      opacity: 0, // Animation handles fading in/out
    };
    return <div key={i} style={style} />;
  });

  return (
    <div className="absolute inset-0 w-full h-full -z-10" aria-hidden="true">
      {particles}
    </div>
  );
};

export default ParticleBackground;
