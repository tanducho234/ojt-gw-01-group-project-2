import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

export const PageNotFound = () => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  // Advanced particle system
  useEffect(() => {
    const generateParticles = () => {
      const particlesArray = Array(100).fill().map((_, index) => ({
        id: index,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 1,
        speed: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
        color: `hsl(${Math.random() * 20 + 340}, 70%, 50%)` // Red tone
      }));
      setParticles(particlesArray);
    };

    generateParticles();
  }, []);

  // Interactive particle movement
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + (mouseX - particle.x) * 0.01,
        y: particle.y + (mouseY - particle.y) * 0.01
      })));
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      onMouseMove={handleMouseMove}
      className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden"
    >
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-700 to-black opacity-80">
        {/* Animated Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              opacity: 0
            }}
            animate={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: particle.speed,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}`
            }}
          />
        ))}
      </div>

      {/* 3D Floating Content */}
      <motion.div 
        className="relative z-10 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 10 
        }}
      >
        {/* Glitchy 404 Text */}
        <motion.h1 
          className="text-9xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600"
          initial={{ rotate: -5, scale: 0.9 }}
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.95, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          404
        </motion.h1>

        {/* Dynamic Subtitle */}
        <motion.p 
          className="text-3xl font-light mb-8 text-red-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Dimensional Rift: Page Not Found
        </motion.p>

        {/* Interactive Return Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            to="/"
            className="inline-block px-8 py-4 text-lg font-semibold 
            bg-gradient-to-r from-red-500 to-red-600 
            text-white rounded-full 
            shadow-2xl hover:shadow-neon 
            transform transition duration-300 
            hover:rotate-6 
            relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            Return to Safe Dimension
          </Link>
        </motion.div>
      </motion.div>

      {/* Additional Cosmic Effects */}
      <style jsx>{`
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(248,56,56,0.5); }
          50% { box-shadow: 0 0 20px rgba(234,51,51,0.7); }
        }

        .hover\:shadow-neon:hover {
          animation: neonPulse 1.5s infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default PageNotFound;
