import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const registerUser = async (data) => {
  try {
    const response = await axios.post(
      "https://ojt-gw-01-final-project-back-end.vercel.app/api/auth/register",
      {
        email: data.email,
        password: data.password,
        fullName: data.name,
      }
    );
    console.log("Registration Successful:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Registration Failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

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
    }
  }
  /* Custom animation styles with responsive durations */
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

  /* Responsive animation speeds */
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

  /* Mobile overlay styles */
@media (max-width: 1024px) {
  .mobile-image-container {
    position: absolute;  
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }
}

    .mobile-form-container {
      position: relative;
      z-index: 10;
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
    }
}
        .register-section {
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
`;

const Register = () => {
  const navigate = useNavigate();

  const images = [
    "/assets/images/reg1.png",
    "/assets/images/reg2.png",
    "/assets/images/reg3.png",
    "/assets/images/reg1.png",
    "/assets/images/reg2.png",
    "/assets/images/reg3.png",
    "/assets/images/reg1.png",
    "/assets/images/reg2.png",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({
    name: true,
    email: true,
    password: true,
    rePassword: true,
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

    const validateField = (fieldName, value) => {
      switch (fieldName) {
        case "name":
          return value.trim().length === 0;
        case "email":
          return !validateEmail(value);
        case "password":
          return value.length < 8;
        case "rePassword":
          return value !== formData.password;
        default:
          return false;
      }
    };

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
    setShowErrorMessages(false);
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
      name: formData.name.trim().length === 0,
      email: !validateEmail(formData.email),
      password: formData.password.length < 8,
      rePassword: formData.rePassword !== formData.password,
    };

    setErrors(newErrors);
    setShowErrorMessages(true);

    if (!Object.values(newErrors).some((error) => error)) {
      await toast.promise(
        registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
          .then(() => {
            toast.success("Registration Successful! 🎉");
            navigate("/login");
          })
          .catch((error) => {
            console.error("Failed to register user:", error);
            throw new Error(
              error.response?.data?.message || "Registration failed."
            );
          }),
        {
          pending: "Registering your account...",
          success: "Registration successful! 🎉",
          error: {
            render({ data }) {
              return (
                data?.response?.data?.message || "Failed to register user."
              );
            },
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen lg:flex relative">
      <style>{styles}</style>
      <ToastContainer closeOnClick={true} />
      {/* Images section - visible on both desktop and mobile */}
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
                        alt={`Register ${index + 1}`}
                        className="w-full rounded-lg shadow-lg clip-path-trapezoid-left transform hover:scale-105 transition duration-300"
                      />
                    </div>
                  ))}
                  {images.slice(0, 4).map((src, index) => (
                    <div key={`down-2-${index}`} className="p-2">
                      <img
                        src={src}
                        alt={`Register ${index + 1}`}
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
                        alt={`Register ${index + 5}`}
                        className="w-full rounded-lg shadow-lg clip-path-trapezoid-right transform hover:scale-105 transition duration-300"
                      />
                    </div>
                  ))}
                  {images.slice(4, 8).map((src, index) => (
                    <div key={`up-2-${index}`} className="p-2">
                      <img
                        src={src}
                        alt={`Register ${index + 5}`}
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

      {/* Form section - overlays images on mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 mobile-form-container min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
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
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    showErrorMessages && errors.name ? "border-red-500" : ""
                  }`}
                />
                {showErrorMessages && errors.name && (
                  <p className="mt-1 text-sm text-red-500">Name is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    showErrorMessages && errors.email ? "border-red-500" : ""
                  }`}
                />
                {showErrorMessages && errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    showErrorMessages && errors.password ? "border-red-500" : ""
                  }`}
                />
                {showErrorMessages && errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Re-enter Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  name="rePassword"
                  value={formData.rePassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    showErrorMessages && errors.rePassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {showErrorMessages && errors.rePassword && (
                  <p className="mt-1 text-sm text-red-500">
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-3xl hover:bg-gray-800 transition">
              Create Account
            </button>

            <div className="text-sm text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium text-black-600 hover:text-indigo-500">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
