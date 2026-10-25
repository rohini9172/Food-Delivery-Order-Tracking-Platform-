import { useState } from "react";
import { useParams } from "react-router-dom";
import useOrderHub from "../hooks/useOrderHub";

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [status, setStatus] = useState("Pending");

  useOrderHub("demo-customer", (update) => {
    if (update.id === id) setStatus(update.status);
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Order Tracking</h1>
      <p>Order ID: {id}</p>
      <p>Status: {status}</p>
    </div>
  );
}
