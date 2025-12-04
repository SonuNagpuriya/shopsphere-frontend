// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      console.log("Login success response:", data);

      // BACKEND RESPONSE NORMALIZE KAR RAHE HAIN
      // Case 1: { _id, name, email, isAdmin, token }
      // Case 2: { user: {...}, token }
      let fullUser;

      if (data && data.token && data._id) {
        fullUser = data;
      } else if (data && data.token && data.user) {
        fullUser = {
          ...data.user,
          token: data.token,
        };
      } else {
        fullUser = data;
      }

      console.log("Login fullUser to save >>>", fullUser);

      login(fullUser);
      navigate("/");
    } catch (err) {
      console.error("Login error full object:", err);
      console.error("Login error response data:", err.response?.data);

      const msg =
        err.response?.data?.message || err.message || "Login failed";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            marginBottom: 8,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Login
        </h2>

        {error && (
          <p
            style={{
              color: "red",
              marginBottom: 12,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 999,
              border: "none",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            marginTop: 16,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#4f46e5" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;