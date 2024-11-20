import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/admin/login" />;
  }
  // Check if user has admin role
  if (user.role !== 'admin') {
    // user is authenticated but not an admin
    return <Navigate to="/admin/login" />;
  }
  return children;
};
