import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Card from "../components/Card";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/cart")
      .then(response => setCart(response.data))
      .catch(() => setError("Could not load your cart. Please try again."));
  }, []);

  const placeOrder = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const orderResponse = await api.post("/api/orders");
      toast.success("Order placed. Payment is processing.");
      navigate(`/order/${orderResponse.data.id}`);
    } catch (requestError) {
      const message = requestError.response?.data?.message ?? "Could not create your order. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error && !cart) return <p className="p-6" role="alert">{error}</p>;
  if (!cart) return <p className="p-6">Loading checkout...</p>;
  if (cart.items.length === 0) {
    return <p className="p-6">Your cart is empty. <button type="button" className="text-blue-600 underline" onClick={() => navigate("/")}>Browse restaurants</button></p>;
  }

  return (
    <div className="p-6 flex justify-center">
      <Card title="Checkout">
        <p className="mb-4 font-semibold">Total: ₹{cart.totalAmount}</p>
        <form onSubmit={placeOrder}>
          {error && <p className="mb-3 text-red-600" role="alert">{error}</p>}
          <Button type="submit" color="green" disabled={isSubmitting}>
            {isSubmitting ? "Placing order..." : "Place Order"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
