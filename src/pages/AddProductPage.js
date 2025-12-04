import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Helper: user admin hai ya nahi
const isAdminUser = (user) => {
  if (!user) return false;
  if (user.role && typeof user.role === "string") {
    if (user.role.toLowerCase() === "admin") return true;
  }
  if (user.admin === true) return true;
  if (user.isAdmin === true) return true;
  return false;
};

const AddProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // AuthContext se logged-in user

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    brand: "",
    category: "",
    price: "",
    countInStock: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Page load par check: admin hai ya nahi
  useEffect(() => {
    if (!user) {
      setError("Please login as admin");
    } else if (!isAdminUser(user)) {
      setError("Admin access only");
    } else {
      setError("");
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Double-check admin
    if (!user || !isAdminUser(user)) {
      setError("Only admin can add products");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock || 0),
      };

      // Pehle yahan const { data } tha, jo use nahi ho raha tha
      await axiosClient.post("/products", payload);

      setSuccess("Product created successfully!");

      // Clear form
      setForm({
        name: "",
        description: "",
        image: "",
        brand: "",
        category: "",
        price: "",
        countInStock: "",
      });

      // 1 second baad admin products list pe bhej do
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (err) {
      console.error("Create product error:", err);
      setError(
        err.response?.data?.message || "Failed to create product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled =
    submitting || !user || !isAdminUser(user);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Add Product (Admin)</h2>

      {error && (
        <p style={{ color: "red", marginTop: "8px" }}>{error}</p>
      )}
      {success && (
        <p style={{ color: "green", marginTop: "8px" }}>{success}</p>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <input
          name="countInStock"
          type="number"
          placeholder="Count In Stock"
          value={form.countInStock}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />

        <button
          type="submit"
          disabled={isDisabled}
          style={{
            marginTop: 8,
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: isDisabled ? "#9ca3af" : "#4f46e5",
            color: "#fff",
            cursor: isDisabled ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {submitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;