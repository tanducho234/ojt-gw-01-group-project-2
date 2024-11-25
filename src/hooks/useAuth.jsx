// src/hooks/useAuth.jsx

import { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";
const AuthContext = createContext();


const URL = "https://ojt-gw-01-final-project-back-end.vercel.app"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);

  const navigate = useNavigate();

  //add usefect call api to verify token
  useEffect(() => {
    console.log("AuthContext mounted")
    const verifyToken = async () => {
      console.log("Token:", token);
      if (token) {
        try {
          const response = await axios.get(`${URL}/api/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.valid) {
            console.log("Token is valid:", response.data.user)
            // Token is valid, store user info in context
            setUser(response.data.user);
          } else {
            logout(); // If token is invalid, logout
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          logout(); // Handle error and logout
        }
      }
      else{
        setUser(null);
        setToken(null)
      }
    };
    verifyToken();
  }, [token]);

  // call this function when you want to authenticate the user
  const login = async (role,token) => {
    setUser({role});
    setToken(token);
    navigate("/admin/dashboard");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    setToken(null); 
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      token
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};