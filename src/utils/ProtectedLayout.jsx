import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export const ProtectedLayout = () => {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
