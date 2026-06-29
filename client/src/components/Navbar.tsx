import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <span>👮 Karen</span>
      <Link to="/dashboard">Home</Link>
      <Link to="/dashboard/logs">Logs</Link>
      <Link to="/dashboard/offenders">Offenders</Link>
      <span>👤 {user?.username}</span>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;
