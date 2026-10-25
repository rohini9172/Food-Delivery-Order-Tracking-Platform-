import { Link } from "react-router-dom";

export default function CartPage() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {cart.map((item, idx) => (
        <p key={idx}>{item.name} x {item.quantity} = ₹{item.price * item.quantity}</p>
      ))}
      <p className="mt-4 font-bold">Total: ₹{total}</p>
      <Link to="/checkout" className="bg-blue-500 text-white px-4 py-2">Checkout</Link>
    </div>
  );
}
