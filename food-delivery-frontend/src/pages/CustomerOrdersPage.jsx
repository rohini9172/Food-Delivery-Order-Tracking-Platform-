import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Assuming backend has endpoint: GET /api/orders/my
    api.get("/api/orders/my")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  if (!orders.length) {
    return <p className="p-6">No orders yet.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border p-4 rounded">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Restaurant:</strong> {order.restaurantName}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <Link 
              to={`/order/${order.id}`} 
              className="text-blue-500 underline"
            >
              Track Order
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
