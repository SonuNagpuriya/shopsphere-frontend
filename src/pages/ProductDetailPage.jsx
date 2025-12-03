import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/products/${id}`);
        setProduct(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching product:", err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load product";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading product...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: "red" }}>
        {error}
        <br />
        <Link to="/" style={{ color: "#4f46e5" }}>
          Go back
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: 24 }}>
        <p>Product not found.</p>
        <Link to="/" style={{ color: "#4f46e5" }}>
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.pageInner}>
        <Link to="/" style={styles.backLink}>
          ← Back to Products
        </Link>

        <section style={styles.detailCard}>
          {/* LEFT – IMAGE */}
          <div style={styles.detailImageWrapper}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={styles.detailImage}
              />
            ) : (
              <span style={styles.noImageText}>No Image</span>
            )}
          </div>

          {/* RIGHT – INFO */}
          <div style={styles.detailContent}>
            <h1 style={styles.detailTitle}>{product.name}</h1>

            <div style={styles.metaGroup}>
              <p style={styles.metaLine}>
                <strong>Category:</strong> {product.category || "N/A"}
              </p>
              <p style={styles.metaLine}>
                <strong>Brand:</strong> {product.brand || "N/A"}
              </p>
              <p style={styles.metaLine}>
                <strong>Price:</strong>{" "}
                <span style={styles.price}>₹{product.price}</span>
              </p>
              <p style={styles.metaLine}>
                <strong>In Stock:</strong>{" "}
                <span
                  style={{
                    color: product.countInStock ? "#16a34a" : "#dc2626",
                    fontWeight: 600,
                  }}
                >
                  {product.countInStock ?? 0}
                </span>
              </p>
            </div>

            <p style={styles.description}>{product.description}</p>

            <div style={styles.actionsRow}>
              <button
                style={{
                  ...styles.cartButton,
                  opacity: product.countInStock ? 1 : 0.6,
                  cursor: product.countInStock ? "pointer" : "not-allowed",
                }}
                disabled={!product.countInStock}
                onClick={() => addToCart(product, 1)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "24px 16px 40px",
    backgroundColor: "#f9fafb",
    minHeight: "calc(100vh - 64px)",
  },
  pageInner: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  backLink: {
    display: "inline-block",
    marginBottom: 16,
    color: "#4f46e5",
    textDecoration: "none",
    fontSize: 14,
  },
  detailCard: {
    display: "flex",
    gap: 32,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
    flexWrap: "wrap",
  },
  detailImageWrapper: {
    flex: "0 1 360px",
    minWidth: 260,
    height: 360,
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  detailImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  noImageText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  detailContent: {
    flex: "1 1 300px",
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 12,
  },
  metaGroup: {
    marginBottom: 16,
  },
  metaLine: {
    margin: "4px 0",
    fontSize: 14,
    color: "#374151",
  },
  price: {
    fontSize: 20,
    fontWeight: 700,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#4b5563",
  },
  actionsRow: {
    marginTop: 20,
    display: "flex",
    gap: 12,
  },
  cartButton: {
    border: "none",
    outline: "none",
    padding: "10px 22px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 600,
    backgroundColor: "#16a34a",
    color: "#fff",
  },
};

export default ProductDetailPage;
