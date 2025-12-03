import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get("/products");
      setProducts(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      // ✅ Correct API: DELETE /api/products/:id
      await axiosClient.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert(
        err.response?.data?.message || "Delete failed. Please try again."
      );
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
    <div style={{ padding: "20px" }}>
      <h2>Admin – Products</h2>

      <div style={{ margin: "10px 0" }}>
        <Link to="/admin/products/new">+ Add New Product</Link>
      </div>

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
            <th style={th}>Image</th>
            <th style={th}>Name</th>
            <th style={th}>Price</th>
            <th style={th}>Stock</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td style={td}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 12, color: "#999" }}>
                    No Image
                  </span>
                )}
              </td>
              <td style={td}>{p.name}</td>
              <td style={td}>₹{p.price}</td>
              <td style={td}>{p.countInStock}</td>
              <td style={td}>
                {/* Future: Edit */}
                {/* <Link to={`/admin/products/${p._id}/edit`}>Edit</Link> |{" "} */}
                <button
                  onClick={() => handleDelete(p._id)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
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

export default AdminProductListPage;
