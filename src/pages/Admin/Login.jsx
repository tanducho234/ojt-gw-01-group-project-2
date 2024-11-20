import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
export const AdminLogin = () => {
  const URL = "https://ojt-gw-01-final-project-back-end.vercel.app";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt with:", username, password);
    // Here you would usually send a request to your backend to authenticate the user
    // For the sake of this example, we're using a mock authentication
    try {
      // Send a POST request to the server using Axios
      const response = await axios.post(`${URL}/api/auth/login`, {
        email: username,
        password: password,
      });

      // Check if the response contains the role as "admin"
      if (response.data.role === "admin") {
        await login(response.data.role,response.data.token);
        // Optionally, store the token or user info in local storage/session
        alert("Login successful!");
      } else {
        alert("You are not authorized to access this page.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        // Server error
        alert(error.response.data.message || "An error occurred");
      } else {
        // Client error
        alert("An error occurred while logging in.");
      }
    }
  };
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <h1>ADMIN LOGIN PAGE</h1>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
