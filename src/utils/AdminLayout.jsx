import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminLayout = () => {
  const { user, token } = useAuth();

  if (!user || !token || user.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return (
    <>
      <div>This is admin nav bar</div>
      <Outlet />
    </>
  );
};
