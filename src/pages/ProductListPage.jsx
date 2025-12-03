import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";

const ProductListPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/products");
        setProducts(res.data || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  if (loading) return <h2 style={{ padding: 24 }}>Loading products...</h2>;
  if (error)
    return (
      <h2 style={{ padding: 24, color: "red" }}>
        {error}
      </h2>
    );

  return (
    <div style={styles.page}>
      <div style={styles.pageInner}>
        <header style={styles.header}>
          <h1 style={styles.title}>ShopSphere Products</h1>

          <div style={styles.filtersRow}>
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.categorySelect}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </header>

        {filteredProducts.length === 0 ? (
          <p style={{ padding: "20px 0" }}>No products found.</p>
        ) : (
          <div style={styles.grid}>
            {filteredProducts.map((product) => (
              <article key={product._id} style={styles.card}>
                {/* IMAGE */}
                <Link
                  to={`/products/${product._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={styles.imageWrapper}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.image}
                      />
                    ) : (
                      <span style={styles.noImageText}>No Image</span>
                    )}
                  </div>
                </Link>

                {/* CONTENT */}
                <div style={styles.cardBody}>
                  <Link
                    to={`/products/${product._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3 style={styles.cardTitle}>{product.name}</h3>
                  </Link>

                  <p style={styles.metaText}>
                    <strong>Category:</strong> {product.category || "N/A"}
                  </p>
                  <p style={styles.metaText}>
                    <strong>Brand:</strong> {product.brand || "N/A"}
                  </p>

                  <p style={styles.priceRow}>
                    <span style={styles.price}>₹{product.price}</span>
                    <span style={styles.stock}>
                      Stock: {product.countInStock ?? 0}
                    </span>
                  </p>
                </div>

                {/* ACTIONS */}
                <div style={styles.cardFooter}>
                  <Link
                    to={`/products/${product._id}`}
                    style={styles.detailsLink}
                  >
                    View Details
                  </Link>

                  <button
                    style={styles.cartButton}
                    disabled={!product.countInStock}
                    onClick={() => addToCart(product, 1)}
                  >
                    {product.countInStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
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
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 16,
  },
  filtersRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  searchInput: {
    flex: "1 1 260px",
    minWidth: 0,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
  },
  categorySelect: {
    flex: "0 0 200px",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    backgroundColor: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.07)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  imageWrapper: {
    width: "100%",
    height: 220,
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  noImageText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  cardBody: {
    padding: "14px 16px 8px",
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  metaText: {
    fontSize: 13,
    color: "#4b5563",
    margin: "2px 0",
  },
  priceRow: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 18,
    fontWeight: 700,
  },
  stock: {
    fontSize: 13,
    color: "#059669",
  },
  cardFooter: {
    padding: "10px 16px 14px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  detailsLink: {
    fontSize: 13,
    textDecoration: "none",
    color: "#4f46e5",
    fontWeight: 500,
  },
  cartButton: {
    border: "none",
    outline: "none",
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    backgroundColor: "#16a34a",
    color: "#fff",
  },
};

export default ProductListPage;
