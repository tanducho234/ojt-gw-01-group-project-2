import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ShipperLayout = () => {
  const { user } = useAuth();

  if (user.role !== "shipper") {
    return <Navigate to="/shipper/login" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};
