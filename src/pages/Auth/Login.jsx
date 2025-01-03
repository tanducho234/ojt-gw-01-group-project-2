import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHouse } from "react-icons/fa6";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { toast, ToastContainer, Bounce } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const styles = `
  .clip-path-trapezoid-right {
    clip-path: polygon(0 0, 100% 4%, 100% 96%, 0% 100%);
  }
  
  .clip-path-trapezoid-left {
    clip-path: polygon(0 4%, 100% 0, 100% 100%, 0 96%);
  }
      /* Responsive margin for image container */
  @media (min-width: 1024px) {
    .image-container-margin {
      margin-left: 20px;
      width: 58%; /* Increased from 50% */
    }
  }

  @keyframes scrollUp {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  }

  @keyframes scrollDown {
    0% {
      transform: translateY(-50%);
    }
    100% {
      transform: translateY(0);
    }
  }

  .animate-scroll-up {
    animation: scrollUp 20s linear infinite;
  }

  .animate-scroll-down {
    animation: scrollDown 20s linear infinite;
  }

  @media (max-width: 1023px) {
    .mobile-image-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      z-index: 10;
    }

    .mobile-form-container {
      position: relative;
      z-index: 20;
      backdrop-filter: blur(8px);
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
      .login-section {
    position: relative;
    overflow: hidden;
    height: 100%;
    min-height: 100vh;
    width: 100%;
  }

  .contained-height {
    height: 100%;
    min-height: 100vh;
  }

  @media (max-width: 768px) {
    .animate-scroll-up {
      animation-duration: 15s;
    }
    .animate-scroll-down {
      animation-duration: 15s;
    }
  }

  @media (max-width: 480px) {
    .animate-scroll-up {
      animation-duration: 10s;
    }
    .animate-scroll-down {
      animation-duration: 10s;
    }
  }
`;

const Login = () => {
  const images = [
    "/assets/images/reg1.png",
    "/assets/images/reg2.png",
    "/assets/images/reg3.png",
    "/assets/images/reg4.png",
    "/assets/images/reg5.png",
    "/assets/images/reg6.png",
    "/assets/images/reg7.png",
    "/assets/images/reg8.png",
  ];
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  const [showErrorMessages, setShowErrorMessages] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "email":
        return !validateEmail(value);
      case "password":
        return value.length < 8;
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);
    setShowErrorMessages(true);
    if (!Object.values(newErrors).some((error) => error)) {
      console.log("Login attempt with:", formData.email, formData.password);
      // Here you would usually send a request to your backend to authenticate the user
      // For the sake of this example, we're using a mock authentication

      await toast.promise(
        axios
          .post(
            `https://ojt-gw-01-final-project-back-end.vercel.app/api/auth/login`,
            {
              email: formData.email,
              password: formData.password,
            }
          )
          .then((response) => {
            if (response.data.role === "user") {
              login(response.data.role, response.data.token);
              toast.success("Login successful! 🎉");
            } else {
              throw new Error("You are not authorized to access this page.");
            }
          }),
        {
          pending: "Logging in...",
          success: "Login successful! 🎉",
          error: {
            render({ data }) {
              // Return error message from server if available
              return (
                data.response?.data?.message ||
                "Login failed. Please try again."
              );
            },
          },
        }
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen lg:flex">
        <style>{styles}</style>
        {/* Images Section */}
        <div className="lg:w-1/2 bg-white-100 relative overflow-hidden mobile-image-container image-container-margin">
          <div className="absolute inset-0 flex">
            {/* Column 1 - Moving down */}
            <div className="w-1/2 relative overflow-hidden">
              <div className="absolute w-full">
                <div className="animate-scroll-down">
                  <div className="flex flex-col">
                    {images.slice(0, 4).map((src, index) => (
                      <div key={`down-1-${index}`} className="p-2">
                        <img
                          src={src}
                          alt={`Login ${index + 1}`}
                          className="w-full rounded-lg shadow-lg clip-path-trapezoid-left transform hover:scale-105 transition duration-300"
                        />
                      </div>
                    ))}
                    {images.slice(0, 4).map((src, index) => (
                      <div key={`down-2-${index}`} className="p-2">
                        <img
                          src={src}
                          alt={`Login ${index + 1}`}
                          className="w-full rounded-lg shadow-lg clip-path-trapezoid-left transform hover:scale-105 transition duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 - Moving up */}
            <div className="w-1/2 relative overflow-hidden">
              <div className="absolute w-full">
                <div className="animate-scroll-up">
                  <div className="flex flex-col">
                    {images.slice(4, 8).map((src, index) => (
                      <div key={`up-1-${index}`} className="p-2">
                        <img
                          src={src}
                          alt={`Login ${index + 5}`}
                          className="w-full rounded-lg shadow-lg clip-path-trapezoid-right transform hover:scale-105 transition duration-300"
                        />
                      </div>
                    ))}
                    {images.slice(4, 8).map((src, index) => (
                      <div key={`up-2-${index}`} className="p-2">
                        <img
                          src={src}
                          alt={`Login ${index + 5}`}
                          className="w-full rounded-lg shadow-lg clip-path-trapezoid-right transform hover:scale-105 transition duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 mobile-form-container min-h-screen">
          <div className="max-w-md w-full bg-white rounded-lg p-8 space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Login to Your Account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your email and password
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                    <span className="text-red-500 ml-1">*</span>
                    {errors.email}
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      Please enter a valid email or phone number
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                    <span className="text-red-500 ml-1">*</span>
                    {errors.password}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/home"
                      className="font-medium text-black-600 hover:text-gray-500 flex items-center gap-2">
                      <FaHouse className="w-4 h-4" />
                      Back to homepage
                    </Link>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-3xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Login
              </button>

              <div className="text-sm text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  to="/register"
                  className="font-medium text-black-600 hover:text-gray-500">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
