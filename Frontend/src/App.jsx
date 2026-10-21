import React from 'react'
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import WhatsAppButton from './components/WhatsAppButton';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import Home from './pages/Home';
import Success from './pages/Success';
import NotFound from './pages/NotFound';
import MenuPage from "./pages/MenuPage";
import FeedbackPage from "./pages/FeedbackPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ── Customer Routes ── */}
        <Route path="/"        element={<Home />} />
        <Route path="/success" element={<Success />} />
        <Route path="/menu"    element={<MenuPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="*"        element={<NotFound />} />

        {/* ── Admin Routes ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
      <WhatsAppButton />
    </Router>
  )
}

export default App