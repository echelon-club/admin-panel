import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Events from "./pages/Events";
import Blogs from "./pages/Blogs";
import Gallery from "./pages/Gallery";
import Logs from "./pages/Logs";
import "./App.css";

function AppShell() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("events");

  if (user === undefined) {
    return (
      <div className="app-loading">
        <div className="app-loading-mark">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="E" />
        </div>
      </div>
    );
  }

  if (user === null) {
    return <Login />;
  }

  const pages = {
    events: <Events />,
    blogs: <Blogs />,
    gallery: <Gallery />,
    logs: <Logs />
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-main">
        {pages[activeTab]}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
