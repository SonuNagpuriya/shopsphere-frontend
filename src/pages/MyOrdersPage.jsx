import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosClient.get("/orders/my");
        setOrders(res.data);
        setError("");
      } catch (err) {
        console.error("My orders error:", err);
        const msg = err.response?.data?.message || "Failed to load orders";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error)
    return (
      <div style={{ padding: 20, color: "red" }}>
        {error}
      </div>
    );

  if (orders.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>My Orders</h2>
        <p>No orders found.</p>
        <Link to="/">Start shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>My Orders</h2>

      <div style={{ marginTop: "16px" }}>
        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>
                <strong>Order ID:</strong> {order._id}
              </span>
              <span>
                <strong>Status:</strong> {order.status}
              </span>
            </div>
            <div>
              <strong>Total:</strong> ₹{order.totalPrice}
            </div>
            <div>
              <strong>Items:</strong>{" "}
              {order.orderItems
                .map((item) => `${item.name} (x${item.qty})`)
                .join(", ")}
            </div>
            <div style={{ fontSize: "12px", marginTop: "4px", color: "#555" }}>
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
