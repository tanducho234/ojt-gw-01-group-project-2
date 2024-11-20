import { useAuth } from "../../hooks/useAuth";

export const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1>This is a admin page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};