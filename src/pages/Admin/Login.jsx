import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { message } from "antd";

export const AdminLogin = () => {
  const URL = "https://ojt-gw-01-final-project-back-end.vercel.app";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    let loadingMessage = message.loading("Signing in...", 0);
    try {
      const response = await axios.post(`${URL}/api/auth/login`, {
        email: username,
        password: password,
      });

      if (response.data.role === "admin") {
        await login(response.data.role, response.data.token);
        loadingMessage()
        message.success("Login successful!");
      } else {
        loadingMessage();
        message.error("You are not authorized to access this page.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        loadingMessage();
        message.error(error.response.data.message || "An error occurred");
      } else {
        loadingMessage();
        message.error("An error occurred while logging in.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/images/bgloginad.png')",
      }}>
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 flex overflow-hidden min-h-[400px] h-[80vh] max-h-[800px]">
        {/* Left Section */}
        <div className="w-1/2 bg-white hidden md:flex items-center justify-center p-8">
          <img
            src="/assets/images/admin_log_pic.png"
            alt="Illustration"
            className="w-3/4"
          />
        </div>
        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-12 bg-white">
          <div className="w-full max-w-sm">
            <h2 className="text-lg font-semibold text-purple-600 mb-4">
              Login as a Admin User
            </h2>
            <form onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="relative mb-4">
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email"
                  className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-4 top-2 text-gray-400">
                  <i className="fas fa-user"></i>
                </span>
              </div>
              {/* Password Input */}
              <div className="relative mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-4 top-2 text-gray-400">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                LOGIN
              </button>
            </form>
            <div className="text-center mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
