import React, { useEffect, useRef, useState } from 'react';

const styles = `
  .clip-path-trapezoid-right {
    clip-path: polygon(0 0, 100% 4%, 100% 96%, 0% 100%);
  }
  
  .clip-path-trapezoid-left {
    clip-path: polygon(0 4%, 100% 0, 100% 100%, 0 96%);
  }
     @media (max-width: 1024px) {
    .overlay-form {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    
    .image-wrapper {
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }
  }
`;
const Register = () => {
  const images = [
    '/assets/images/reg1.png',
    '/assets/images/reg2.png',
    '/assets/images/reg3.png',
    '/assets/images/reg1.png',
    '/assets/images/reg2.png',
    '/assets/images/reg3.png',
    '/assets/images/reg1.png',
    '/assets/images/reg2.png',
  ];

  const DISPLAY_TIME = 4000;
  const FADE_TIME = 3000;
  const TOTAL_CYCLE = DISPLAY_TIME + FADE_TIME * 3;

  const canvasRefs = {
    col1: useRef([null, null, null, null]),
    col2: useRef([null, null, null, null]),
  };

  const [loadedImages, setLoadedImages] = useState([]);
  const [currentIndices, setCurrentIndices] = useState({
    col1: [0, 1, 2, 3],
    col2: [4, 5, 6, 7],
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    rePassword: false,
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
        });
      });
      const loadedImgs = await Promise.all(imagePromises);
      setLoadedImages(loadedImgs);
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (loadedImages.length === 0) return;

    const animateCanvas = (canvas, image, startDelay) => {
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime + startDelay) % TOTAL_CYCLE;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let opacity = 0;
        if (elapsed < FADE_TIME) {
          opacity = elapsed / FADE_TIME;
        } else if (elapsed < FADE_TIME + DISPLAY_TIME) {
          opacity = 1;
        } else if (elapsed < TOTAL_CYCLE) {
          opacity = 1 - (elapsed - FADE_TIME - DISPLAY_TIME) / FADE_TIME;
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
        const aspectRatio = 3 / 4;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;

        if (canvasWidth / canvasHeight > aspectRatio) {
          drawWidth = canvasHeight * aspectRatio;
        } else {
          drawHeight = canvasWidth / aspectRatio;
        }

        const x = (canvasWidth - drawWidth) / 2;
        const y = (canvasHeight - drawHeight) / 2;

        ctx.drawImage(image, x, y, drawWidth, drawHeight);

        return requestAnimationFrame(animate);
      };

      return requestAnimationFrame(animate);
    };

    const animationIds = [];

    currentIndices.col1.forEach((imgIndex, i) => {
      const canvas = canvasRefs.col1.current[i];
      if (canvas && loadedImages[imgIndex]) {
        const delay = (i * TOTAL_CYCLE) / 4;
        const animationId = animateCanvas(canvas, loadedImages[imgIndex], delay);
        if (animationId) animationIds.push(animationId);
      }
    });

    currentIndices.col2.forEach((imgIndex, i) => {
      const canvas = canvasRefs.col2.current[i];
      if (canvas && loadedImages[imgIndex]) {
        const delay = ((i * TOTAL_CYCLE) / 4) + TOTAL_CYCLE / 8;
        const animationId = animateCanvas(canvas, loadedImages[imgIndex], delay);
        if (animationId) animationIds.push(animationId);
      }
    });

    return () => {
      animationIds.forEach((id) => cancelAnimationFrame(id));
    };
  }, [loadedImages, currentIndices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const validateField = (fieldName, value, allValues) => {
    switch (fieldName) {
      case 'email':
        return !validateEmail(value);
      case 'password':
        return value.length < 8;
      case 'rePassword':
        return value !== allValues.password;
      case 'name':
        return value.length === 0;
      default:
        return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name, formData),
      email: validateField('email', formData.email, formData),
      password: validateField('password', formData.password, formData),
      rePassword: validateField('rePassword', formData.rePassword, formData),
    };

    setErrors(newErrors);

    // If no errors, proceed with submission
    if (!Object.values(newErrors).some(error => error)) {
      console.log('Form submitted:', formData);
      // Add your submission logic here
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <style>{styles}</style>
    <main className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left side - Images */}
        <div className="relative h-[400px] md:h-[600px] lg:h-[800px] overflow-hidden">
          <div className="absolute inset-0 flex gap-[10px]">
            {/* Column 1 */}
            <div className="w-[calc(50%-5px)]">
              <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={`col1-${index}`}
                    className={`relative overflow-hidden aspect-[3/4] ${
                      index % 2 === 0 ? 'clip-path-trapezoid-right' : 'clip-path-trapezoid-left'
                    }`}
                  >
                    <canvas
                      ref={el => canvasRefs.col1.current[index] = el}
                      className="w-full h-full"
                      width={400}
                      height={533}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 */}
            <div className="w-[calc(50%-5px)]">
              <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={`col2-${index}`}
                    className={`relative overflow-hidden aspect-[3/4] ${
                      index % 2 === 0 ? 'clip-path-trapezoid-right' : 'clip-path-trapezoid-left'
                    }`}
                  >
                    <canvas
                      ref={el => canvasRefs.col2.current[index] = el}
                      className="w-full h-full"
                      width={400}
                      height={533}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
          {/* Right Side - Form */}
          <div className="w-full lg:w-1/1 flex items-center justify-center p-8 ">
        <div className="max-w-md w-full space-y-8 ">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your details below
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                  {errors.name && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email or Phone Number
                  {errors.email && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                  {errors.password && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">Password must be at least 8 characters long</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Re-enter Password
                  {errors.rePassword && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="password"
                  name="rePassword"
                  value={formData.rePassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.rePassword ? 'border-red-500' : ''
                  }`}
                />
                {errors.rePassword && (
                  <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-3xl hover:bg-gray-800 transition"
            >
              Create Account
            </button>

            <div className="text-sm text-center">
              <span className="text-gray-600">Already have an account? </span>
              <a href="#" className="font-medium text-gray-600 hover:text-indigo-500">
                Log In
              </a>
            </div>
          </form>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
};

export default Register;