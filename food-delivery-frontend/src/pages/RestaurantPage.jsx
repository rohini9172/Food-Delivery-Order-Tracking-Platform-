import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    api.get(`/api/restaurants/${id}`).then(res => setRestaurant(res.data));
  }, [id]);

  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...item, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{restaurant.name}</h1>
      <ul>
        {restaurant.menuItems.map(item => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name} - ₹{item.price}</span>
            <button onClick={() => addToCart(item)} className="bg-green-500 text-white px-2">Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
