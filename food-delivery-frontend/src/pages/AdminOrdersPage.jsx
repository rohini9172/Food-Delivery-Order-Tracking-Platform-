import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_CLASS = {
  Pending: "badge-pending",
  Paid:    "badge-confirmed",
  Failed:  "badge-cancelled",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/orders/admin/all")
      .then(r => setOrders(r.data))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-root"><div className="section"><p className="page-loading">Loading orders…</p></div></div>;
  if (error)   return <div className="page-root"><div className="section"><p className="page-error">{error}</p></div></div>;

  return (
    <div className="page-root">
      <div className="section">
        <div className="admin-orders-header">
          <h1 className="page-title" style={{ marginBottom: 0 }}>All Customer Orders</h1>
          <span className="admin-orders-count">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-icon">📋</p>
            <p className="empty-state-msg">No orders placed yet.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className="order-card">

                {/* Header */}
                <div className="order-card-header">
                  <div>
                    <p className="order-restaurant">{order.restaurantName ?? "Unknown Restaurant"}</p>
                    <p className="order-date">#{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <span className={`status-badge ${STATUS_CLASS[order.status] ?? "badge-pending"}`}>
                    {order.status}
                  </span>
                </div>

                {/* Customer ID */}
                <div className="admin-order-customer">
                  <span className="admin-order-customer-label">Customer</span>
                  <span className="admin-order-customer-id">{order.customerId.slice(0, 8).toUpperCase()}…</span>
                </div>

                {/* Items */}
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i} className="order-item-chip">{item.name} ×{item.quantity}</span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="order-item-chip order-item-more">+{order.items.length - 3} more</span>
                  )}
                </div>

                {/* Footer */}
                <div className="order-card-footer">
                  <span className="order-date">{new Date(order.createdAt).toLocaleString()}</span>
                  <span className="order-total">₹{order.totalAmount.toFixed(2)}</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
