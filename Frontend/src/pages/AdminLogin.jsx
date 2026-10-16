import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";

const API = `${BACKEND_URL}/api/v1/admin`;

const AdminLogin = () => {
  const navigate = useNavigate();

  // ── Login state ──────────────────────────────────────────
  const [adminId, setAdminId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Check if already logged in ────────────────────────────
  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // ── Login handler ────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!adminId.trim() || !loginPassword) {
      toast.error("Please enter your Admin ID and password.");
      return;
    }
    setLoginLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/login`,
        { adminId: adminId.trim(), password: loginPassword },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminId", data.admin.adminId);
      localStorage.setItem("adminName", data.admin.adminId || data.admin.name);
      toast.success(`Welcome back, ${data.admin.adminId || data.admin.name}! 🎉`);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        {/* ── Logo ── */}
        <div className="admin-login-logo">
          <span className="admin-login-brand">DT</span>
          <span className="admin-login-brand-sub">Restro</span>
        </div>
        <p className="admin-login-tagline">Authorized Owner Portal</p>

        {/* ══════════ LOGIN FORM ══════════ */}
        <form className="admin-login-form" onSubmit={handleLogin} id="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="login-id">Admin ID</label>
            <input
              id="login-id"
              type="text"
              placeholder="Enter your Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              autoComplete="username"
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
          <button
            type="submit"
            className="admin-login-btn"
            id="admin-login-btn"
            disabled={loginLoading}
          >
            {loginLoading ? <span className="admin-spinner" /> : "Sign In →"}
          </button>
          <div className="admin-login-security-notice">
            🔒 Restricted Area. Public registration is permanently disabled.
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
