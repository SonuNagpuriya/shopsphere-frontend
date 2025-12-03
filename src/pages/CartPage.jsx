import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, updateQty, removeFromCart, totalItems, totalPrice } =
    useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
        <Link to="/">Go back to products</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 0" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 20px",         
        }}
      >
        <h2>Your Cart ({totalItems} items)</h2>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Left - items */}
          <div style={{ flex: "1 1 60%" }}>
            {cartItems.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: "flex",
                  gap: "16px",
                  borderBottom: "1px solid #eee",
                  padding: "12px 0",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "6px",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      No Image
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 4px" }}>{item.name}</h4>
                  <p style={{ margin: "2px 0" }}>Price: ₹{item.price}</p>
                  <p style={{ margin: "2px 0" }}>
                    Subtotal: ₹{item.price * item.qty}
                  </p>

                  <div style={{ marginTop: "6px", display: "flex", gap: 8 }}>
                    <button
                      onClick={() =>
                        updateQty(item.productId, Math.max(1, item.qty - 1))
                      }
                      style={qtyBtn}
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() =>
                        updateQty(
                          item.productId,
                          Math.min(
                            item.qty + 1,
                            item.countInStock || item.qty + 1
                          )
                        )
                      }
                      style={qtyBtn}
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      style={{
                        marginLeft: "16px",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - summary */}
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
            <p style={{ margin: "8px 0" }}>Items: {totalItems}</p>
            <p style={{ margin: "8px 0", fontWeight: 600 }}>
              Total: ₹{totalPrice}
            </p>

            <button
              onClick={() => navigate("/checkout")} // future use
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4f46e5",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const qtyBtn = {
  padding: "2px 8px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  cursor: "pointer",
};

export default CartPage;
