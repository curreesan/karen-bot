import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <span className="nav-brand">👮 Karen</span>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/logs">Logs</Link>
      <Link to="/dashboard/offenders">Offenders</Link>
      <div className="nav-right">
        <span className="nav-user">👤 {user?.username}</span>
        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
