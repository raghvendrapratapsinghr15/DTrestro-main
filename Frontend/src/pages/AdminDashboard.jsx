import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";

const API = `${BACKEND_URL}/api/v1/admin`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  withCredentials: true,
});

const STATUS_COLORS = {
  Pending:   { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  Confirmed: { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  Cancelled: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

// ── Sub-components ────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent }) => (
  <div className="adm-stat-card" style={{ borderTopColor: accent }}>
    <div className="adm-stat-icon" style={{ background: accent + "22", color: accent }}>{icon}</div>
    <div>
      <p className="adm-stat-label">{label}</p>
      <h3 className="adm-stat-value">{value ?? "—"}</h3>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return (
    <span className="adm-badge" style={{ background: s.bg, color: s.color }}>
      <span className="adm-badge-dot" style={{ background: s.dot }} />
      {status}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState(
    localStorage.getItem("adminId") || localStorage.getItem("adminName") || "Admin"
  );

  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "reservations" | "credentials"
  const [selectedRes, setSelectedRes] = useState(null);
  const [updating, setUpdating] = useState(null);

  // ── Credentials Management State ───────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newAdminId, setNewAdminId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingCreds, setUpdatingCreds] = useState(false);

  // ── Sync Admin Profile on Mount ────────────────────────────
  useEffect(() => {
    axios
      .get(`${API}/me`, authHeaders())
      .then(({ data }) => {
        if (data.admin?.adminId) {
          setAdminName(data.admin.adminId);
          localStorage.setItem("adminId", data.admin.adminId);
          localStorage.setItem("adminName", data.admin.adminId);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleLogout();
        }
      });
  }, []);

  // ── Fetch Stats ────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/stats`, authHeaders());
      setStats(data.stats);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  }, []);

  // ── Fetch Reservations ─────────────────────────────────────────────────────
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== "All") params.status = filterStatus;
      if (filterDate) params.date = filterDate;
      if (search) params.search = search;

      const { data } = await axios.get(`${API}/reservations`, {
        ...authHeaders(),
        params,
      });
      setReservations(data.reservations);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      else toast.error("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterDate, search]);

  useEffect(() => {
    fetchStats();
    fetchReservations();
  }, [fetchStats, fetchReservations]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try { await axios.get(`${API}/logout`, authHeaders()); } catch (_) {}
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  // ── Change Credentials Handler ─────────────────────────────
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    const trimmedNewId = newAdminId.trim();
    if (!trimmedNewId && !newPassword) {
      toast.error("Please provide a new Admin ID or new Password to update.");
      return;
    }
    if (trimmedNewId && trimmedNewId.length < 3) {
      toast.error("Admin ID must be at least 3 characters long.");
      return;
    }
    if (newPassword) {
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match.");
        return;
      }
    }

    setUpdatingCreds(true);
    try {
      const payload = { currentPassword };
      if (trimmedNewId) payload.newAdminId = trimmedNewId;
      if (newPassword) payload.newPassword = newPassword;

      const { data } = await axios.put(`${API}/change-credentials`, payload, authHeaders());
      toast.success(data.message || "Credentials updated successfully!");
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }
      if (data.admin?.adminId) {
        setAdminName(data.admin.adminId);
        localStorage.setItem("adminId", data.admin.adminId);
        localStorage.setItem("adminName", data.admin.adminId);
      }
      setCurrentPassword("");
      setNewAdminId("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update credentials.");
    } finally {
      setUpdatingCreds(false);
    }
  };

  // ── Update Status ──────────────────────────────────────────────────────────
  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axios.put(
        `${API}/reservations/${id}/status`,
        { status },
        authHeaders()
      );
      toast.success(`Status updated to ${status}`);
      fetchReservations();
      fetchStats();
      if (selectedRes?._id === id) setSelectedRes((p) => ({ ...p, status }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(null);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteReservation = async (id) => {
    if (!window.confirm("Delete this reservation permanently?")) return;
    try {
      await axios.delete(`${API}/reservations/${id}`, authHeaders());
      toast.success("Reservation deleted.");
      setSelectedRes(null);
      fetchReservations();
      fetchStats();
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  // ── Search debounce ────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setFilterStatus("All");
    setFilterDate("");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="adm-shell">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <span className="adm-logo-dt">DT</span>
          <span className="adm-logo-rest">Restro</span>
        </div>

        <nav className="adm-nav">
          <button
            className={`adm-nav-item${activeView === "dashboard" ? " active" : ""}`}
            onClick={() => setActiveView("dashboard")}
          >
            <span>📊</span> Dashboard
          </button>
          <button
            className={`adm-nav-item${activeView === "reservations" ? " active" : ""}`}
            onClick={() => setActiveView("reservations")}
          >
            <span>📋</span> Reservations
          </button>
          <button
            className={`adm-nav-item${activeView === "credentials" ? " active" : ""}`}
            onClick={() => setActiveView("credentials")}
          >
            <span>🔐</span> Change ID / Password
          </button>
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-user-info">
            <div className="adm-user-avatar">{adminName.charAt(0).toUpperCase()}</div>
            <div>
              <p className="adm-user-name">{adminName}</p>
              <p className="adm-user-role">Administrator</p>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={handleLogout}>
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────── */}
      <main className="adm-main">
        {/* ── Topbar ── */}
        <header className="adm-topbar">
          <div>
            <h1 className="adm-topbar-title">
              {activeView === "dashboard"
                ? "Dashboard Overview"
                : activeView === "reservations"
                ? "All Reservations"
                : "Security & Credentials"}
            </h1>
            <p className="adm-topbar-sub">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button className="adm-refresh-btn" onClick={() => { fetchStats(); fetchReservations(); }}>
            ↺ Refresh
          </button>
        </header>

        {/* ══════════════════ DASHBOARD VIEW ══════════════════ */}
        {activeView === "dashboard" && (
          <div className="adm-dashboard-view">
            {/* Stat cards */}
            <div className="adm-stats-grid">
              <StatCard icon="📅" label="Total Bookings"    value={stats?.total}     accent="#d4a843" />
              <StatCard icon="🌅" label="Today's Bookings"  value={stats?.todayCount} accent="#6366f1" />
              <StatCard icon="⏳" label="Upcoming"          value={stats?.upcoming}   accent="#10b981" />
              <StatCard icon="🔔" label="Pending"           value={stats?.pending}    accent="#f59e0b" />
              <StatCard icon="✅" label="Confirmed"         value={stats?.confirmed}  accent="#22c55e" />
              <StatCard icon="❌" label="Cancelled"         value={stats?.cancelled}  accent="#ef4444" />
            </div>

            {/* Recent reservations preview */}
            <div className="adm-card adm-recent-card">
              <div className="adm-card-header">
                <h2>Recent Reservations</h2>
                <button className="adm-text-btn" onClick={() => setActiveView("reservations")}>
                  View all →
                </button>
              </div>
              <div className="adm-table-wrap">
                <ReservationsTable
                  reservations={reservations.slice(0, 5)}
                  loading={loading}
                  onSelect={setSelectedRes}
                  onStatusChange={updateStatus}
                  onDelete={deleteReservation}
                  updating={updating}
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ RESERVATIONS VIEW ══════════════════ */}
        {activeView === "reservations" && (
          <div className="adm-reservations-view">
            {/* Filters bar */}
            <div className="adm-filters-bar">
              <input
                className="adm-search"
                type="text"
                placeholder="🔍  Search by name, phone, or email…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <select
                className="adm-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <input
                className="adm-date-input"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              <button className="adm-clear-btn" onClick={clearFilters}>
                ✕ Clear
              </button>
            </div>

            <div className="adm-card">
              <div className="adm-card-header">
                <h2>Reservations <span className="adm-count-badge">{reservations.length}</span></h2>
              </div>
              <div className="adm-table-wrap">
                <ReservationsTable
                  reservations={reservations}
                  loading={loading}
                  onSelect={setSelectedRes}
                  onStatusChange={updateStatus}
                  onDelete={deleteReservation}
                  updating={updating}
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ CREDENTIALS VIEW ══════════════════ */}
        {activeView === "credentials" && (
          <div className="adm-credentials-view">
            <div className="adm-card adm-cred-card">
              <div className="adm-card-header">
                <div>
                  <h2>Change Admin ID & Password</h2>
                  <p className="adm-card-sub">
                    Update your login credentials. You must enter your current password to authorize any changes.
                  </p>
                </div>
              </div>

              <div className="adm-current-id-badge">
                <span>Active Admin ID:</span> <strong>{adminName}</strong>
              </div>

              <form className="adm-cred-form" onSubmit={handleUpdateCredentials}>
                <div className="adm-form-group">
                  <label htmlFor="cred-current-pass">Current Password *</label>
                  <input
                    id="cred-current-pass"
                    type="password"
                    placeholder="Enter current password to verify"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <div className="adm-form-divider">
                  <span>New Credentials (fill at least one)</span>
                </div>

                <div className="adm-form-group">
                  <label htmlFor="cred-new-id">New Admin ID (Optional)</label>
                  <input
                    id="cred-new-id"
                    type="text"
                    placeholder="Enter new Admin ID (leave empty to keep unchanged)"
                    value={newAdminId}
                    onChange={(e) => setNewAdminId(e.target.value)}
                    autoComplete="username"
                  />
                </div>

                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label htmlFor="cred-new-pass">New Password (Optional)</label>
                    <input
                      id="cred-new-pass"
                      type="password"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label htmlFor="cred-confirm-pass">Confirm New Password</label>
                    <input
                      id="cred-confirm-pass"
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="adm-cred-btn"
                  id="adm-cred-submit-btn"
                  disabled={updatingCreds}
                >
                  {updatingCreds ? "Updating Credentials..." : "🔒 Update Credentials"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── Detail Modal ──────────────────────────────── */}
      {selectedRes && (
        <ReservationModal
          res={selectedRes}
          onClose={() => setSelectedRes(null)}
          onStatusChange={updateStatus}
          onDelete={deleteReservation}
          updating={updating}
        />
      )}
    </div>
  );
};

// ── Reservations Table ────────────────────────────────────────────────────────
const ReservationsTable = ({ reservations, loading, onSelect, onStatusChange, onDelete, updating }) => {
  if (loading) return <div className="adm-loading"><span className="adm-spinner-lg" /></div>;
  if (!reservations.length) return <div className="adm-empty">No reservations found.</div>;

  return (
    <table className="adm-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Phone</th>
          <th>Date</th>
          <th>Time</th>
          <th>Guests</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((r) => (
          <tr key={r._id} onClick={() => onSelect(r)} className="adm-table-row">
            <td>
              <div className="adm-customer-cell">
                <div className="adm-customer-avatar">{r.firstName.charAt(0)}</div>
                <div>
                  <p className="adm-customer-name">{r.firstName} {r.lastName}</p>
                  <p className="adm-customer-email">{r.email}</p>
                </div>
              </div>
            </td>
            <td>{r.phone}</td>
            <td>{r.date}</td>
            <td>{r.time}</td>
            <td className="adm-center">{r.guests || 1}</td>
            <td onClick={(e) => e.stopPropagation()}>
              <select
                className="adm-status-select"
                value={r.status}
                disabled={updating === r._id}
                onChange={(e) => onStatusChange(r._id, e.target.value)}
                style={{
                  background: STATUS_COLORS[r.status]?.bg,
                  color: STATUS_COLORS[r.status]?.color,
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </td>
            <td onClick={(e) => e.stopPropagation()}>
              <div className="adm-action-btns">
                <button className="adm-btn-view"   onClick={() => onSelect(r)}>View</button>
                <button className="adm-btn-delete" onClick={() => onDelete(r._id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ── Detail Modal ──────────────────────────────────────────────────────────────
const ReservationModal = ({ res, onClose, onStatusChange, onDelete, updating }) => (
  <div className="adm-modal-overlay" onClick={onClose}>
    <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
      <div className="adm-modal-header">
        <h2>Reservation Details</h2>
        <button className="adm-modal-close" onClick={onClose}>✕</button>
      </div>

      <div className="adm-modal-body">
        <div className="adm-modal-avatar">{res.firstName.charAt(0)}</div>
        <h3 className="adm-modal-name">{res.firstName} {res.lastName}</h3>
        <StatusBadge status={res.status} />

        <div className="adm-modal-grid">
          <div className="adm-modal-item"><span>📧 Email</span><p>{res.email}</p></div>
          <div className="adm-modal-item"><span>📱 Phone</span><p>{res.phone}</p></div>
          <div className="adm-modal-item"><span>📅 Date</span><p>{res.date}</p></div>
          <div className="adm-modal-item"><span>🕐 Time</span><p>{res.time}</p></div>
          <div className="adm-modal-item"><span>👥 Guests</span><p>{res.guests || 1}</p></div>
          <div className="adm-modal-item"><span>🗓 Booked On</span>
            <p>{res.createdAt ? new Date(res.createdAt).toLocaleDateString("en-IN") : "—"}</p>
          </div>
        </div>

        {res.specialMessage && (
          <div className="adm-modal-note">
            <span>💬 Special Request</span>
            <p>{res.specialMessage}</p>
          </div>
        )}
      </div>

      <div className="adm-modal-footer">
        <div className="adm-modal-status-row">
          <label>Update Status:</label>
          <select
            className="adm-status-select"
            value={res.status}
            disabled={updating === res._id}
            onChange={(e) => onStatusChange(res._id, e.target.value)}
            style={{
              background: STATUS_COLORS[res.status]?.bg,
              color: STATUS_COLORS[res.status]?.color,
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button className="adm-btn-delete" onClick={() => { onDelete(res._id); onClose(); }}>
          🗑 Delete
        </button>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
