import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar({ activeTab, setActiveTab }) {
  const { user } = useAuth();
  const tabs = ["events", "blogs", "gallery", "logs"];

  function handleSignOut() {
    signOut(auth);
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="nav-brand">
          <div className="logo-mark">
            <img src="/logo.png" alt="E" className="logo-img" />
          </div>
          <span className="nav-brand-label">Admin Panel</span>
        </div>
        <div className="nav-divider" />
        <ul className="nav-tabs">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-right">
        {user && (
          <span className="user-pill">{user.email}</span>
        )}
        <button className="logout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
