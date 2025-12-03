import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Helper: user admin hai ya nahi check karo (flexible)
const isAdminUser = (user) => {
  if (!user) return false;

  // case 1: role field use ho rahi ho
  if (user.role && typeof user.role === "string") {
    if (user.role.toLowerCase() === "admin") return true;
  }

  // case 2: boolean admin / isAdmin field
  if (user.admin === true) return true;
  if (user.isAdmin === true) return true;

  return false;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
