import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";

const API = `${BACKEND_URL}/api/v1/admin`;
const API_FEEDBACK = `${BACKEND_URL}/api/v1/feedback`;

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
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "reservations" | "feedbacks" | "credentials"
  const [selectedRes, setSelectedRes] = useState(null);
  const [updating, setUpdating] = useState(null);

  // ── Feedback Management State ──────────────────────────────
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackSearchInput, setFeedbackSearchInput] = useState("");
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState("All");
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);
  const [feedbackTotalCount, setFeedbackTotalCount] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [deletingFeedbackId, setDeletingFeedbackId] = useState(null);

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

  // ── Fetch Reservation Stats ────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/stats`, authHeaders());
      setStats(data.stats);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  }, []);

  // ── Fetch Feedback Stats ───────────────────────────────────────────────────
  const fetchFeedbackStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_FEEDBACK}/stats`, authHeaders());
      if (data.success) {
        setFeedbackStats(data.stats);
      }
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

  // ── Fetch Feedbacks ────────────────────────────────────────────────────────
  const fetchFeedbacks = useCallback(async () => {
    setFeedbackLoading(true);
    try {
      const params = {
        page: feedbackPage,
        limit: 8,
      };
      if (feedbackRatingFilter !== "All") params.rating = feedbackRatingFilter;
      if (feedbackSearch) params.search = feedbackSearch;

      const { data } = await axios.get(`${API_FEEDBACK}/all`, {
        ...authHeaders(),
        params,
      });
      if (data.success) {
        setFeedbacks(data.feedbacks || []);
        setFeedbackTotalPages(data.totalPages || 1);
        setFeedbackTotalCount(data.total || 0);
      }
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      else toast.error("Failed to load feedback records.");
    } finally {
      setFeedbackLoading(false);
    }
  }, [feedbackRatingFilter, feedbackSearch, feedbackPage]);

  useEffect(() => {
    fetchStats();
    fetchReservations();
    fetchFeedbackStats();
  }, [fetchStats, fetchReservations, fetchFeedbackStats]);

  useEffect(() => {
    if (activeView === "feedbacks" || activeView === "dashboard") {
      fetchFeedbacks();
    }
  }, [activeView, fetchFeedbacks]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try { await axios.get(`${API}/logout`, authHeaders()); } catch (_) {}
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  // ── Delete Feedback Handler ────────────────────────────────
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Permanently delete this feedback from the database?")) return;
    setDeletingFeedbackId(id);
    try {
      await axios.delete(`${API_FEEDBACK}/${id}`, authHeaders());
      toast.success("Feedback deleted successfully.");
      if (selectedFeedback?._id === id) setSelectedFeedback(null);
      fetchFeedbacks();
      fetchFeedbackStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete feedback.");
    } finally {
      setDeletingFeedbackId(null);
    }
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

  // ── Update Reservation Status ──────────────────────────────
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

  // ── Delete Reservation ─────────────────────────────────────
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

  // ── Search debounces ───────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFeedbackSearch(feedbackSearchInput);
      setFeedbackPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [feedbackSearchInput]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setFilterStatus("All");
    setFilterDate("");
  };

  const clearFeedbackFilters = () => {
    setFeedbackSearchInput("");
    setFeedbackSearch("");
    setFeedbackRatingFilter("All");
    setFeedbackPage(1);
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
            className={`adm-nav-item${activeView === "feedbacks" ? " active" : ""}`}
            onClick={() => setActiveView("feedbacks")}
          >
            <span>⭐</span> Feedbacks ({feedbackStats?.totalFeedback ?? 0})
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
                : activeView === "feedbacks"
                ? "Guest Feedbacks & Ratings"
                : "Security & Credentials"}
            </h1>
            <p className="adm-topbar-sub">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            className="adm-refresh-btn"
            onClick={() => {
              fetchStats();
              fetchReservations();
              fetchFeedbackStats();
              if (activeView === "feedbacks") fetchFeedbacks();
            }}
          >
            ↺ Refresh
          </button>
        </header>

        {/* ══════════════════ DASHBOARD VIEW ══════════════════ */}
        {activeView === "dashboard" && (
          <div className="adm-dashboard-view">
            {/* Stat cards */}
            <div className="adm-stats-grid">
              <StatCard icon="📅" label="Total Bookings"   value={stats?.total} accent="#d4a843" />
              <StatCard icon="🌅" label="Today's Bookings" value={stats?.todayCount} accent="#6366f1" />
              <StatCard icon="⏳" label="Upcoming"         value={stats?.upcoming} accent="#10b981" />
              <StatCard icon="🔔" label="Pending"          value={stats?.pending} accent="#f59e0b" />
              <StatCard
                icon="⭐"
                label="Feedbacks"
                value={feedbackStats?.totalFeedback ?? stats?.totalFeedback ?? "0"}
                accent="#ec4899"
              />
              <StatCard
                icon="🏆"
                label="Avg Rating"
                value={
                  feedbackStats?.averageRating
                    ? `${feedbackStats.averageRating} ★`
                    : stats?.avgRating
                    ? `${stats.avgRating} ★`
                    : "—"
                }
                accent="#eab308"
              />
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

            {/* Recent Feedbacks Preview */}
            <div className="adm-card adm-recent-card" style={{ marginTop: "24px" }}>
              <div className="adm-card-header">
                <h2>Recent Guest Feedbacks</h2>
                <button className="adm-text-btn" onClick={() => setActiveView("feedbacks")}>
                  View all ({feedbackStats?.totalFeedback ?? 0}) →
                </button>
              </div>
              <div className="adm-table-wrap">
                <FeedbackTable
                  feedbacks={feedbacks.slice(0, 5)}
                  loading={feedbackLoading}
                  onSelect={setSelectedFeedback}
                  onDelete={handleDeleteFeedback}
                  deletingId={deletingFeedbackId}
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

        {/* ══════════════════ FEEDBACKS VIEW ══════════════════ */}
        {activeView === "feedbacks" && (
          <div className="adm-reservations-view">
            {/* Feedback KPI Summary Cards */}
            <div className="adm-feedback-summary-grid">
              <div className="adm-feedback-overview-card" style={{ "--card-accent": "#d4a843" }}>
                <div className="adm-feedback-icon-box">💬</div>
                <div>
                  <div className="adm-feedback-kpi-val">{feedbackStats?.totalFeedback ?? 0}</div>
                  <div className="adm-feedback-kpi-sub">Total Submissions</div>
                </div>
              </div>

              <div className="adm-feedback-overview-card" style={{ "--card-accent": "#fbbf24" }}>
                <div className="adm-feedback-icon-box">★</div>
                <div>
                  <div className="adm-feedback-kpi-val">
                    {feedbackStats?.averageRating ? `${feedbackStats.averageRating} / 5` : "0.0 / 5"}
                  </div>
                  <div className="adm-feedback-kpi-sub">Overall Average Rating</div>
                </div>
              </div>

              <div className="adm-feedback-overview-card" style={{ "--card-accent": "#10b981" }}>
                <div className="adm-feedback-icon-box">🏆</div>
                <div>
                  <div className="adm-feedback-kpi-val">
                    {feedbackStats?.breakdown?.fiveStar ?? 0}
                  </div>
                  <div className="adm-feedback-kpi-sub">5-Star Perfect Ratings</div>
                </div>
              </div>
            </div>

            {/* Star Distribution Breakdown */}
            {feedbackStats && feedbackStats.totalFeedback > 0 && (
              <div className="adm-rating-breakdown-card">
                <div className="adm-breakdown-header">
                  <h3>Rating Distribution</h3>
                  <div className="adm-breakdown-avg">
                    <span>{feedbackStats.averageRating}</span>
                    <span>★</span>
                  </div>
                </div>
                <div className="adm-breakdown-bars">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const keyMap = { 5: "fiveStar", 4: "fourStar", 3: "threeStar", 2: "twoStar", 1: "oneStar" };
                    const count = feedbackStats.breakdown?.[keyMap[stars]] || 0;
                    const percent = feedbackStats.totalFeedback > 0 ? (count / feedbackStats.totalFeedback) * 100 : 0;
                    return (
                      <div className="adm-bar-row" key={stars}>
                        <div className="adm-bar-label">{stars} Stars ★</div>
                        <div className="adm-bar-track">
                          <div className="adm-bar-fill" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="adm-bar-count">{count} ({percent.toFixed(0)}%)</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback Filter Bar */}
            <div className="adm-filters-bar">
              <input
                className="adm-search"
                type="text"
                placeholder="🔍  Search by UID, user name, or feedback text…"
                value={feedbackSearchInput}
                onChange={(e) => setFeedbackSearchInput(e.target.value)}
              />
              <select
                className="adm-select"
                value={feedbackRatingFilter}
                onChange={(e) => {
                  setFeedbackRatingFilter(e.target.value);
                  setFeedbackPage(1);
                }}
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★</option>
                <option value="3">3 Stars ★★★</option>
                <option value="2">2 Stars ★★</option>
                <option value="1">1 Star ★</option>
              </select>
              <button className="adm-clear-btn" onClick={clearFeedbackFilters}>
                ✕ Clear
              </button>
            </div>

            {/* Feedback Records Card */}
            <div className="adm-card">
              <div className="adm-card-header">
                <h2>
                  Feedback Records{" "}
                  <span className="adm-count-badge">{feedbackTotalCount}</span>
                </h2>
              </div>
              <div className="adm-table-wrap">
                <FeedbackTable
                  feedbacks={feedbacks}
                  loading={feedbackLoading}
                  onSelect={setSelectedFeedback}
                  onDelete={handleDeleteFeedback}
                  deletingId={deletingFeedbackId}
                />
              </div>

              {/* Pagination Bar */}
              {feedbackTotalPages > 1 && (
                <div className="adm-pagination-bar">
                  <span>
                    Showing page {feedbackPage} of {feedbackTotalPages} ({feedbackTotalCount} total reviews)
                  </span>
                  <div className="adm-page-buttons">
                    <button
                      className="adm-page-btn"
                      disabled={feedbackPage <= 1 || feedbackLoading}
                      onClick={() => setFeedbackPage((p) => Math.max(1, p - 1))}
                    >
                      ← Previous
                    </button>
                    <span className="adm-page-info">
                      {feedbackPage} / {feedbackTotalPages}
                    </span>
                    <button
                      className="adm-page-btn"
                      disabled={feedbackPage >= feedbackTotalPages || feedbackLoading}
                      onClick={() => setFeedbackPage((p) => Math.min(feedbackTotalPages, p + 1))}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
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

      {/* ── Reservation Detail Modal ── */}
      {selectedRes && (
        <ReservationModal
          res={selectedRes}
          onClose={() => setSelectedRes(null)}
          onStatusChange={updateStatus}
          onDelete={deleteReservation}
          updating={updating}
        />
      )}

      {/* ── Feedback Detail Modal ── */}
      {selectedFeedback && (
        <FeedbackModal
          fb={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onDelete={handleDeleteFeedback}
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

// ── Feedback Table Component ──────────────────────────────────────────────────
const FeedbackTable = ({ feedbacks, loading, onSelect, onDelete, deletingId }) => {
  if (loading) return <div className="adm-loading"><span className="adm-spinner-lg" /></div>;
  if (!feedbacks.length) return <div className="adm-empty">No feedback records found.</div>;

  return (
    <table className="adm-table">
      <thead>
        <tr>
          <th>UID</th>
          <th>User</th>
          <th>Rating</th>
          <th>Experience Feedback</th>
          <th>Improvement Suggestions</th>
          <th>Submitted On</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {feedbacks.map((fb) => (
          <tr key={fb._id} onClick={() => onSelect(fb)} className="adm-table-row">
            <td>
              <span className="adm-uid-badge">{fb.feedbackId || "FB-—"}</span>
            </td>
            <td>
              <div className="adm-customer-cell">
                <img
                  src={fb.userImage || "/review_1.png"}
                  alt={fb.userName}
                  className="adm-customer-avatar"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/review_1.png";
                  }}
                />
                <div>
                  <p className="adm-customer-name">{fb.userName || "Guest Diner"}</p>
                </div>
              </div>
            </td>
            <td>
              <div className="adm-stars-cell">
                {"★".repeat(fb.rating)}
                <span style={{ color: "#71717a", fontSize: "0.8rem", marginLeft: "4px" }}>
                  ({fb.rating}/5)
                </span>
              </div>
            </td>
            <td>
              <p className="adm-text-clamp">{fb.userExperience}</p>
            </td>
            <td>
              <p className="adm-text-muted-clamp">
                {fb.improvementSuggestions ? fb.improvementSuggestions : "— None —"}
              </p>
            </td>
            <td style={{ fontSize: "0.82rem", color: "var(--brand-muted)", whiteSpace: "nowrap" }}>
              {fb.createdAt
                ? new Date(fb.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </td>
            <td onClick={(e) => e.stopPropagation()}>
              <div className="adm-action-btns">
                <button className="adm-btn-view" onClick={() => onSelect(fb)}>
                  View
                </button>
                <button
                  className="adm-btn-delete"
                  disabled={deletingId === fb._id}
                  onClick={() => onDelete(fb._id)}
                >
                  {deletingId === fb._id ? "..." : "Delete"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ── Reservation Detail Modal ──────────────────────────────────────────────────
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

// ── Feedback Detail Modal ─────────────────────────────────────────────────────
const FeedbackModal = ({ fb, onClose, onDelete }) => (
  <div className="adm-modal-overlay" onClick={onClose}>
    <div className="adm-modal adm-modal-feedback-card" onClick={(e) => e.stopPropagation()}>
      <div className="adm-modal-header">
        <div>
          <h2>Feedback Details</h2>
          <span className="adm-uid-badge" style={{ marginTop: "4px" }}>
            UID: {fb.feedbackId}
          </span>
        </div>
        <button className="adm-modal-close" onClick={onClose}>✕</button>
      </div>

      <div className="adm-modal-body">
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
          <img
            src={fb.userImage || "/review_1.png"}
            alt={fb.userName}
            style={{ width: "54px", height: "54px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand-gold)" }}
            onError={(e) => { e.target.src = "/review_1.png"; }}
          />
          <div>
            <h3 className="adm-modal-name" style={{ margin: 0, textAlign: "left" }}>
              {fb.userName || "Guest Diner"}
            </h3>
            <div className="adm-stars-cell" style={{ fontSize: "1.2rem", marginTop: "4px" }}>
              {"★".repeat(fb.rating)}
              <span style={{ color: "#d4a843", fontSize: "0.85rem", marginLeft: "6px", fontWeight: "bold" }}>
                ({fb.rating} of 5 Stars)
              </span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "left", marginBottom: "14px" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--brand-gold)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
            Experience Feedback:
          </span>
          <div className="adm-feedback-quote-block">
            "{fb.userExperience}"
          </div>
        </div>

        {fb.improvementSuggestions && (
          <div style={{ textAlign: "left", marginBottom: "14px" }}>
            <span style={{ fontSize: "0.8rem", color: "#38bdf8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
              Improvement Suggestions:
            </span>
            <div className="adm-feedback-suggestion-block">
              {fb.improvementSuggestions}
            </div>
          </div>
        )}

        <div className="adm-modal-grid" style={{ marginTop: "16px" }}>
          <div className="adm-modal-item">
            <span>🗓 Submitted Date</span>
            <p>
              {fb.createdAt
                ? new Date(fb.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
          <div className="adm-modal-item">
            <span>🕐 Time</span>
            <p>
              {fb.createdAt
                ? new Date(fb.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="adm-modal-footer">
        <button
          className="adm-btn-delete"
          onClick={() => {
            onDelete(fb._id);
            onClose();
          }}
        >
          🗑 Delete Feedback
        </button>
        <button
          className="adm-page-btn"
          onClick={onClose}
          style={{ background: "#3f3f46" }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
