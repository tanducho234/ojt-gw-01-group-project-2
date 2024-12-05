import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const UnderConstructionPage = () => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  // Generate particles
  useEffect(() => {
    const generateParticles = () => {
      const particlesArray = Array(200)
        .fill()
        .map((_, index) => ({
          id: index,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 2 + 0.5,
          delay: Math.random() * 5,
          color: `rgba(255, 255, 255, ${Math.random()})`,
        }));
      setParticles(particlesArray);
    };

    generateParticles();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative flex items-center justify-center min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url("https://www.icdsoft.com/blog/wp-content/uploads/2023/06/mainttitle.jpg")' }}
    >
      {/* Background: Starry Space */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://www.icdsoft.com/blog/wp-content/uploads/2023/06/mainttitle.jpg)", // Replace with a proper space image URL
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)",
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Animated Particles (Stars) */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full z-10"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 5px ${particle.color}`,
          }}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0,
          }}
          animate={{
            x: [`${particle.x}%`, `${particle.x + Math.random() * 2 - 1}%`],
            y: [`${particle.y}%`, `${particle.y + Math.random() * 2 - 1}%`],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.speed,
            delay: particle.delay,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Center Content */}
      <motion.div
        className="relative z-20 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Title */}
        <motion.h1
          className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-gray-800 to-black"


          initial={{ rotate: -5 }}
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          Coming Soon
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-2xl font-medium text-black-300 mt-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          A cosmic journey is underway. Stay tuned for an extraordinary launch!
        </motion.p>

        {/* Notify Me Button */}
        <motion.a
          href="#"
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 inline-block px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl transition duration-300"
        >
          Notify Me
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default UnderConstructionPage;
