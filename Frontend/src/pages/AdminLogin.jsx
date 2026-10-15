  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import toast from "react-hot-toast";

  const API = "http://localhost:3000/api/v1/admin";

  // ─────────────────────────────────────────────────────────────
  const AdminLogin = () => {
    const navigate  = useNavigate();
    const [tab, setTab]               = useState("login");   // "login" | "signup"
    const [adminExists, setAdminExists] = useState(true);    // default: assume admin exists (secure)
    const [checkDone, setCheckDone]   = useState(false);

    // ── Login state ──────────────────────────────────────────
    const [loginEmail,    setLoginEmail]    = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginLoading,  setLoginLoading]  = useState(false);

    // ── Signup state ─────────────────────────────────────────
    const [signName,      setSignName]      = useState("");
    const [signEmail,     setSignEmail]     = useState("");
    const [signPassword,  setSignPassword]  = useState("");
    const [signConfirm,   setSignConfirm]   = useState("");
    const [signLoading,   setSignLoading]   = useState(false);

    // ── Check if any admin exists ────────────────────────────
    useEffect(() => {
      // If already logged in, redirect
      if (localStorage.getItem("adminToken")) {
        navigate("/admin/dashboard");
        return;
      }
      axios.get(`${API}/check-setup`)
        .then(({ data }) => {
          setAdminExists(data.adminExists);
          // If no admin yet, show signup tab first
          if (!data.adminExists) setTab("signup");
        })
        .catch(() => setAdminExists(true)) // fail safe: hide signup
        .finally(() => setCheckDone(true));
    }, [navigate]);

    // ── Login handler ────────────────────────────────────────
    const handleLogin = async (e) => {
      e.preventDefault();
      if (!loginEmail || !loginPassword) {
        toast.error("Please enter email and password.");
        return;
      }
      setLoginLoading(true);
      try {
        const { data } = await axios.post(
          `${API}/login`,
          { email: loginEmail, password: loginPassword },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminName",  data.admin.name);
        toast.success(`Welcome back, ${data.admin.name}! 🎉`);
        navigate("/admin/dashboard");
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed. Check your credentials.");
      } finally {
        setLoginLoading(false);
      }
    };

    // ── Signup handler ───────────────────────────────────────
    const handleSignup = async (e) => {
      e.preventDefault();
      if (!signName || !signEmail || !signPassword || !signConfirm) {
        toast.error("Please fill all fields.");
        return;
      }
      if (signPassword !== signConfirm) {
        toast.error("Passwords do not match.");
        return;
      }
      if (signPassword.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      setSignLoading(true);
      try {
        await axios.post(
          `${API}/register`,
          { name: signName, email: signEmail, password: signPassword },
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("Admin account created! Please log in.");
        setAdminExists(true);
        setTab("login");
        setLoginEmail(signEmail);
        setSignName(""); setSignEmail(""); setSignPassword(""); setSignConfirm("");
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed.");
      } finally {
        setSignLoading(false);
      }
    };

    if (!checkDone) {
      return (
        <div className="admin-login-page">
          <div className="admin-auth-checking">
            <span className="adm-spinner-lg" />
          </div>
        </div>
      );
    }

    return (
      <div className="admin-login-page">
        <div className="admin-login-card">

          {/* ── Logo ── */}
          <div className="admin-login-logo">
            <span className="admin-login-brand">DT</span>
            <span className="admin-login-brand-sub">Restro</span>
          </div>
          <p className="admin-login-tagline">Restaurant Management Panel</p>

          {/* ── Tabs ── */}
          <div className="admin-auth-tabs">
            <button
              className={`admin-auth-tab${tab === "login" ? " active" : ""}`}
              onClick={() => setTab("login")}
            >
              🔑 Sign In
            </button>
            <button
              className={`admin-auth-tab${tab === "signup" ? " active" : ""}`}
              onClick={() => setTab("signup")}
            >
              Create Account
            </button>
          </div>

          {/* ══════════ LOGIN FORM ══════════ */}
          {tab === "login" && (
            <form className="admin-login-form" onSubmit={handleLogin} id="admin-login-form">
              <div className="admin-form-group">
                <label htmlFor="login-email">Admin Email</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="e.g. admin@dtrestro.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="admin-login-btn" id="admin-login-btn" disabled={loginLoading}>
                {loginLoading ? <span className="admin-spinner" /> : "Sign In →"}
              </button>
              <p className="admin-login-hint">
                {adminExists
                  ? "Access restricted to authorised administrators only."
                  : "No account yet? Switch to Create Account tab."}
              </p>
            </form>
          )}

          {/* ══════════ SIGNUP FORM ══════════ */}
          {tab === "signup" && (
            <form className="admin-login-form" onSubmit={handleSignup} id="admin-signup-form">
              <div className="admin-setup-banner">
                Create an admin account
              </div>
              <div className="admin-form-group">
                <label htmlFor="sign-name">Your Name</label>
                <input
                  id="sign-name"
                  type="text"
                  placeholder="e.g. Harsh Kumar"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="sign-email">Admin Email</label>
                <input
                  id="sign-email"
                  type="email"
                  placeholder="e.g. harsh@dtrestro.com"
                  value={signEmail}
                  onChange={(e) => setSignEmail(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="sign-password">Password</label>
                <input
                  id="sign-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={signPassword}
                  onChange={(e) => setSignPassword(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="sign-confirm">Confirm Password</label>
                <input
                  id="sign-confirm"
                  type="password"
                  placeholder="Repeat your password"
                  value={signConfirm}
                  onChange={(e) => setSignConfirm(e.target.value)}
                />
                {signPassword && signConfirm && signPassword !== signConfirm && (
                  <span className="admin-field-error">Passwords do not match</span>
                )}
              </div>
              <button type="submit" className="admin-login-btn" id="admin-signup-btn" disabled={signLoading}>
                {signLoading ? <span className="admin-spinner" /> : "Create Account →"}
              </button>
              <p className="admin-login-hint">
                Set your name, email and password to access the admin panel.
              </p>
            </form>
          )}

        </div>
      </div>
    );
  };

  export default AdminLogin;
