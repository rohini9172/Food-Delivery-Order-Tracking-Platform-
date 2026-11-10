import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const STATUS_BADGE = {
  Pending:   "badge-pending",
  Confirmed: "badge-confirmed",
  Cancelled: "badge-cancelled",
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/orders/my")
      .then(r => setOrders(r.data))
      .catch(() => setError("Could not load your orders. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-root"><div className="section"><p className="page-loading">Loading orders…</p></div></div>;
  if (error)   return <div className="page-root"><div className="section"><p className="page-error">{error}</p></div></div>;

  return (
    <div className="page-root">
      <div className="section">
        <h1 className="page-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-icon">📦</p>
            <p className="empty-state-msg">No orders yet.</p>
            <Link to="/" className="btn-primary">Browse Restaurants</Link>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <p className="order-restaurant">{order.restaurantName}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span className={`status-badge ${STATUS_BADGE[order.status] ?? "badge-pending"}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i} className="order-item-chip">{item.name} × {item.quantity}</span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="order-item-chip order-item-more">+{order.items.length - 3} more</span>
                  )}
                </div>

                <div className="order-card-footer">
                  <span className="order-total">₹{order.totalAmount}</span>
                  <Link to={`/order/${order.id}`} className="btn-sm-primary">Track →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
