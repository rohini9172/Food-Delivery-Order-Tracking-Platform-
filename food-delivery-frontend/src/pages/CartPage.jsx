import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/cart")
      .then(response => setCart(response.data))
      .catch(() => setError("Could not load your cart. Please try again."));
  }, []);

  const updateQuantity = async (item, quantity) => {
    try {
      const response = await api.put(`/api/cart/items/${item.menuItemId}`, { quantity });
      setCart(response.data);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message ?? "Could not update the cart.");
    }
  };

  const removeItem = async (item) => {
    try {
      const response = await api.delete(`/api/cart/items/${item.menuItemId}`);
      setCart(response.data);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message ?? "Could not remove this item.");
    }
  };

  if (error) return <p className="p-6" role="alert">{error}</p>;
  if (!cart) return <p className="p-6">Loading cart...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p className="mt-4">Your cart is empty. <Link className="text-blue-600 underline" to="/">Browse restaurants</Link></p>
      ) : (
        <>
          <p className="mt-2 text-gray-600">{cart.restaurantName}</p>
          <div className="mt-4 space-y-3">
            {cart.items.map(item => (
              <div key={item.menuItemId} className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p>₹{item.price} each · Subtotal ₹{item.subtotal}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label={`Decrease ${item.name} quantity`} disabled={item.quantity <= 1} onClick={() => updateQuantity(item, item.quantity - 1)} className="rounded border px-3 py-1 disabled:opacity-50">−</button>
                  <span>{item.quantity}</span>
                  <button type="button" aria-label={`Increase ${item.name} quantity`} disabled={item.quantity >= 99} onClick={() => updateQuantity(item, item.quantity + 1)} className="rounded border px-3 py-1 disabled:opacity-50">+</button>
                  <button type="button" onClick={() => removeItem(item)} className="ml-2 text-red-600 underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-bold">Total: ₹{cart.totalAmount}</p>
          <Link to="/checkout" className="mt-4 inline-block bg-blue-500 px-4 py-2 text-white">Checkout</Link>
        </>
      )}
    </div>
  );
}
