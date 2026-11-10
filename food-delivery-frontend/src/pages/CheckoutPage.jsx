import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/cart")
      .then(r => setCart(r.data))
      .catch(() => setError("Could not load your cart. Please try again."));
  }, []);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      const res = await api.post("/api/orders");
      toast.success("Order placed! Payment is processing…");
      navigate(`/order/${res.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.message ?? "Could not place order. Please try again.";
      setError(msg); toast.error(msg);
    } finally { setSubmitting(false); }
  };

  if (error && !cart) return <div className="page-root"><div className="section"><p className="page-error">{error}</p></div></div>;
  if (!cart) return <div className="page-root"><div className="section"><p className="page-loading">Loading checkout…</p></div></div>;
  if (cart.items.length === 0) return (
    <div className="page-root"><div className="section">
      <div className="empty-state">
        <p className="empty-state-icon">🛒</p>
        <p className="empty-state-msg">Your cart is empty.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Browse Restaurants</button>
      </div>
    </div></div>
  );

  return (
    <div className="page-root">
      <div className="section checkout-section">
        <h1 className="page-title">Checkout</h1>
        <div className="checkout-layout">

          {/* Order summary */}
          <div className="checkout-summary">
            <h2 className="checkout-summary-title">📋 Order Summary</h2>
            <p className="checkout-restaurant">📍 {cart.restaurantName}</p>
            <div className="checkout-items">
              {cart.items.map(item => (
                <div key={item.menuItemId} className="checkout-item">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-qty">× {item.quantity}</span>
                  <span className="checkout-item-price">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <span>Total Amount</span>
              <span className="checkout-total-amount">₹{cart.totalAmount}</span>
            </div>
          </div>

          {/* Place order panel */}
          <div className="checkout-panel">
            <h2 className="checkout-panel-title">💳 Payment</h2>
            <div className="checkout-info-box">
              <p>🔒 Secure mock payment</p>
              <p>Your order will be confirmed or cancelled automatically within seconds.</p>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <form onSubmit={placeOrder}>
              <button type="submit" className="btn-primary checkout-place-btn" disabled={submitting}>
                {submitting ? "Placing order…" : `Place Order · ₹${cart.totalAmount}`}
              </button>
            </form>
            <p className="checkout-note">You will be redirected to live order tracking after placing.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
