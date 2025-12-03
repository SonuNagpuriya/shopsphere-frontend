import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get("/orders");
      setOrders(res.data);
      setError("");
    } catch (err) {
      console.error("Admin orders error:", err);
      const msg = err.response?.data?.message || "Failed to load orders";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosClient.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error)
    return (
      <div style={{ padding: 20, color: "red" }}>
        {error}
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin – Orders</h2>

      <table
        style={{
          width: "100%",
          marginTop: "16px",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr>
            <th style={th}>Order ID</th>
            <th style={th}>User</th>
            <th style={th}>Total</th>
            <th style={th}>Status</th>
            <th style={th}>Date</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td style={td}>{o._id}</td>
              <td style={td}>
                {o.user?.name} <br />
                <span style={{ fontSize: 12, color: "#555" }}>
                  {o.user?.email}
                </span>
              </td>
              <td style={td}>₹{o.totalPrice}</td>
              <td style={td}>{o.status}</td>
              <td style={td}>
                {new Date(o.createdAt).toLocaleString()}
              </td>
              <td style={td}>
                <select
                  value={o.status}
                  onChange={(e) =>
                    handleStatusChange(o._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const th = {
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  padding: "8px",
};

const td = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};

export default AdminOrdersPage;
