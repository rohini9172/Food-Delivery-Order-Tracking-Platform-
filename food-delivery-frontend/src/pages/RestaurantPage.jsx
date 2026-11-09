import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/restaurants/${id}`)
      .then(res => {
        setRestaurant(res.data);
        setError("");
      })
      .catch(() => setError("Could not load this restaurant. Please try again."));
  }, [id]);

  const addToCart = async (item) => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    try {
      await api.post("/api/cart/items", { menuItemId: item.id, quantity: 1 });
      toast.success(`${item.name} added to your cart.`);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message ?? "Could not add this item to your cart.");
    }
  };

  if (error) return <p className="p-6" role="alert">{error}</p>;
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
