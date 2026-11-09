import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useOrderHub from "../hooks/useOrderHub.jsx";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [pageError, setPageError] = useState("");

  const handleOrderUpdate = useCallback((update) => {
    if (update.orderId.toLowerCase() === id.toLowerCase()) {
      setOrder(current => current ? { ...current, status: update.status } : current);
    }
  }, [id]);

  const { connectionState, error: hubError } = useOrderHub(user?.id, handleOrderUpdate);

  useEffect(() => {
    let active = true;
    api.get(`/api/orders/${id}`)
      .then(response => {
        if (!active) return;
        setOrder(response.data);
        setPageError("");
      })
      .catch(requestError => {
        if (!active) return;
        setPageError(requestError.response?.status === 404
          ? "Order not found."
          : "Could not load this order. Please try again.");
      });

    return () => {
      active = false;
    };
  }, [id, connectionState]);

  if (pageError) return <p className="p-6" role="alert">{pageError}</p>;
  if (!order) return <p className="p-6">Loading order...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Order Tracking</h1>
      <p>Order ID: {order.id}</p>
      <p>Restaurant: {order.restaurantName}</p>
      <p>Total: ₹{order.totalAmount}</p>
      <p>Status: <strong>{order.status}</strong></p>
      <p>Live updates: {connectionState.toLowerCase()}</p>
      {hubError && <p role="alert">{hubError}</p>}
      {order.status === "Pending" && <p className="mt-3">Payment is being processed. This page will update automatically.</p>}
      {order.status === "Cancelled" && <p className="mt-3 text-red-600">Payment failed and the order was cancelled.</p>}
      <ul className="mt-4 list-inside list-disc">
        {order.items.map((item, index) => (
          <li key={`${item.name}-${index}`}>{item.name} × {item.quantity} — ₹{item.subtotal}</li>
        ))}
      </ul>
    </div>
  );
}
