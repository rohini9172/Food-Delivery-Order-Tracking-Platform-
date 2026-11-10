import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const FALLBACK = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    api.get("/api/cart")
      .then(r => setCart(r.data))
      .catch(() => setError("Could not load your cart. Please try again."));
  }, []);

  const updateQty = async (item, qty) => {
    setBusy(item.menuItemId);
    try {
      const r = await api.put(`/api/cart/items/${item.menuItemId}`, { quantity: qty });
      setCart(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Could not update cart.");
    } finally { setBusy(null); }
  };

  const remove = async (item) => {
    setBusy(item.menuItemId);
    try {
      const r = await api.delete(`/api/cart/items/${item.menuItemId}`);
      setCart(r.data);
      toast.success(`${item.name} removed.`);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Could not remove item.");
    } finally { setBusy(null); }
  };

  if (error) return <div className="page-root"><div className="section"><p className="page-error">{error}</p></div></div>;
  if (!cart) return <div className="page-root"><div className="section"><p className="page-loading">Loading cart…</p></div></div>;

  return (
    <div className="page-root">
      <div className="section">
        <h1 className="page-title">🛒 Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-icon">🍽️</p>
            <p className="empty-state-msg">Your cart is empty.</p>
            <Link to="/" className="btn-primary">Browse Restaurants</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              <p className="cart-restaurant-label">📍 {cart.restaurantName}</p>
              {cart.items.map(item => (
                <div key={item.menuItemId} className="cart-item">
                  <img
                    src={item.imageUrl || FALLBACK}
                    alt={item.name}
                    className="cart-item-img"
                    onError={e => { e.currentTarget.src = FALLBACK; }}
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">₹{item.price} each</p>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="qty-btn"
                      disabled={item.quantity <= 1 || busy === item.menuItemId}
                      onClick={() => updateQty(item, item.quantity - 1)}
                      aria-label="Decrease"
                    >−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      disabled={item.quantity >= 99 || busy === item.menuItemId}
                      onClick={() => updateQty(item, item.quantity + 1)}
                      aria-label="Increase"
                    >+</button>
                  </div>
                  <p className="cart-item-subtotal">₹{item.subtotal}</p>
                  <button
                    className="cart-remove-btn"
                    onClick={() => remove(item)}
                    disabled={busy === item.menuItemId}
                    aria-label="Remove"
                  >🗑</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>
              <div className="cart-summary-rows">
                {cart.items.map(item => (
                  <div key={item.menuItemId} className="cart-summary-row">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
                <span>₹{cart.totalAmount}</span>
              </div>
              <Link to="/checkout" className="btn-primary cart-checkout-btn">
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
