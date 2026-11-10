import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useOrderHub from "../hooks/useOrderHub.jsx";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const STATUS_META = {
  Pending:   { icon: "⏳", label: "Payment Processing", cls: "status-pending",   pulse: true  },
  Confirmed: { icon: "✅", label: "Order Confirmed",    cls: "status-confirmed", pulse: false },
  Cancelled: { icon: "❌", label: "Order Cancelled",    cls: "status-cancelled", pulse: false },
};

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [pageError, setPageError] = useState("");

  const handleOrderUpdate = useCallback((update) => {
    if (update.orderId.toLowerCase() === id.toLowerCase()) {
      setOrder(cur => cur ? { ...cur, status: update.status } : cur);
    }
  }, [id]);

  const { connectionState, error: hubError } = useOrderHub(user?.id, handleOrderUpdate);

  useEffect(() => {
    let active = true;
    api.get(`/api/orders/${id}`)
      .then(r => { if (active) { setOrder(r.data); setPageError(""); } })
      .catch(err => { if (active) setPageError(err.response?.status === 404 ? "Order not found." : "Could not load order."); });
    return () => { active = false; };
  }, [id, connectionState]);

  if (pageError) return <div className="page-root"><div className="section"><p className="page-error">{pageError}</p></div></div>;
  if (!order) return <div className="page-root"><div className="section"><p className="page-loading">Loading order…</p></div></div>;

  const meta = STATUS_META[order.status] ?? STATUS_META.Pending;

  return (
    <div className="page-root">
      <div className="section tracking-section">
        <div className="tracking-header">
          <h1 className="page-title">Order Tracking</h1>
          <div className={`tracking-hub-badge ${connectionState === "Connected" ? "hub-connected" : "hub-disconnected"}`}>
            <span className="hub-dot" /> {connectionState === "Connected" ? "Live" : connectionState}
          </div>
        </div>
        {hubError && <p className="form-error">{hubError}</p>}

        {/* Status card */}
        <div className={`tracking-status-card ${meta.cls}`}>
          <span className={`tracking-status-icon ${meta.pulse ? "pulse" : ""}`}>{meta.icon}</span>
          <div>
            <p className="tracking-status-label">{meta.label}</p>
            {order.status === "Pending" && (
              <p className="tracking-status-sub">Waiting for payment confirmation. This page updates automatically.</p>
            )}
            {order.status === "Confirmed" && (
              <p className="tracking-status-sub">Payment successful! Your food is being prepared.</p>
            )}
            {order.status === "Cancelled" && (
              <p className="tracking-status-sub">Payment was declined. No charge was made.</p>
            )}
          </div>
        </div>

        <div className="tracking-layout">
          {/* Order details */}
          <div className="tracking-details">
            <h2 className="tracking-card-title">Order Details</h2>
            <div className="tracking-meta-rows">
              <div className="tracking-meta-row">
                <span>Restaurant</span><span>{order.restaurantName}</span>
              </div>
              <div className="tracking-meta-row">
                <span>Order ID</span>
                <span className="tracking-order-id">{order.id.slice(0, 8)}…</span>
              </div>
              <div className="tracking-meta-row">
                <span>Placed</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="tracking-items-card">
            <h2 className="tracking-card-title">Items Ordered</h2>
            <div className="tracking-items">
              {order.items.map((item, i) => (
                <div key={`${item.name}-${i}`} className="tracking-item">
                  <span className="tracking-item-name">{item.name}</span>
                  <span className="tracking-item-qty">× {item.quantity}</span>
                  <span className="tracking-item-price">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
            <div className="tracking-total">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="tracking-actions">
          <Link to="/orders" className="btn-ghost">← My Orders</Link>
          <Link to="/" className="btn-primary">Order Again</Link>
        </div>
      </div>
    </div>
  );
}
