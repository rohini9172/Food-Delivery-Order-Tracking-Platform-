import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";

export default function CheckoutPage() {
  const [method, setMethod] = useState("Card");
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePay = async () => {
    const orderId = crypto.randomUUID();
    try {
      const res = await api.post("/api/payments", {
        orderId,
        customerId: "demo-customer",
        amount: total,
        method
      });
      alert(res.data.message);
      navigate(`/order/${orderId}`);
    } catch (err) {
      alert("Payment failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <Card title="Checkout">
        <p className="mb-4 font-semibold">Total: ₹{total}</p>
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          className="border rounded px-3 py-2 mb-4 w-full"
        >
          <option>Card</option>
          <option>UPI</option>
          <option>Wallet</option>
        </select>
        <Button onClick={handlePay} color="green">Pay Now</Button>
      </Card>
    </div>
  );
}
