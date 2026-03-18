import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "./Login.css";

const errorMessages = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-email": "Invalid email address.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/invalid-credential": "Invalid email or password."
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(errorMessages[err.code] || "Sign-in failed. Check your credentials.");
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-mark">
            <img src={process.env.PUBLIC_URL + "/logo.png"} alt="E" className="login-logo-img" />
          </div>
          <span className="login-logo-text">Club Admin</span>
        </div>

        <h2>Welcome back.</h2>
        <p>Sign in to manage events, blogs, and gallery.</p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@jainuniversity.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
