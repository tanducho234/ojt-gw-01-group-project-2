import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
export const HomeLayout = () => {
  const { user } = useAuth();

  if (user) {
    if (window.location.pathname === "/login") {
      return <Navigate to="/" />;
    }
  }

  return (
    <>
    {/* <div>this is homelayout</div> */}
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
