import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
        <Link to="/">Go back to products</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setShipping((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      }));

      const body = {
        orderItems,
        shippingAddress: shipping,
      };

      await axiosClient.post("/orders", body);

      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Create order error:", err);
      const msg = err.response?.data?.message || "Failed to place order";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 60%" }}>
          <h2>Checkout</h2>

          {error && (
            <p style={{ color: "red", marginTop: "8px" }}>{error}</p>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
            <div style={{ marginBottom: 8 }}>
              <label>Full Name</label>
              <input
                name="fullName"
                value={shipping.fullName}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Address</label>
              <input
                name="address"
                value={shipping.address}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>City</label>
              <input
                name="city"
                value={shipping.city}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Postal Code</label>
              <input
                name="postalCode"
                value={shipping.postalCode}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Country</label>
              <input
                name="country"
                value={shipping.country}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Phone</label>
              <input
                name="phone"
                value={shipping.phone}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 10,
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4f46e5",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>
          </form>
        </div>

        <div
          style={{
            flex: "0 0 260px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#fff",
          }}
        >
          <h3>Order Summary</h3>
          <p style={{ margin: "8px 0" }}>
            Items: {cartItems.reduce((sum, i) => sum + i.qty, 0)}
          </p>
          <p style={{ margin: "8px 0", fontWeight: 600 }}>
            Total: ₹{totalPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
