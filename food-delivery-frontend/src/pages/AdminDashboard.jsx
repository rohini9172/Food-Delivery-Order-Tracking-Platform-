import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({ name: "", location: "" });
  const [menuItem, setMenuItem] = useState({ restaurantId: "", name: "", price: 0 });

  // Load restaurants
  useEffect(() => {
    api.get("/api/restaurants").then(res => setRestaurants(res.data));
  }, []);

  // Add restaurant
  const addRestaurant = async () => {
    try {
      await api.post("/api/restaurants/add", newRestaurant);
      alert("Restaurant added!");
      setNewRestaurant({ name: "", location: "" });
      const res = await api.get("/api/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      alert("Error adding restaurant: " + err.message);
    }
  };

  // Add menu item
  const addMenuItem = async () => {
    try {
      await api.post(`/api/restaurants/${menuItem.restaurantId}/menu`, {
        name: menuItem.name,
        price: menuItem.price
      });
      alert("Menu item added!");
      setMenuItem({ restaurantId: "", name: "", price: 0 });
    } catch (err) {
      alert("Error adding menu item: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Add Restaurant */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Add Restaurant</h2>
        <input
          type="text"
          placeholder="Name"
          value={newRestaurant.name}
          onChange={e => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={newRestaurant.location}
          onChange={e => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={addRestaurant} className="bg-blue-500 text-white px-4 py-2">Add</button>
      </div>

      {/* Add Menu Item */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Add Menu Item</h2>
        <select
          value={menuItem.restaurantId}
          onChange={e => setMenuItem({ ...menuItem, restaurantId: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Restaurant</option>
          {restaurants.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Item Name"
          value={menuItem.name}
          onChange={e => setMenuItem({ ...menuItem, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={menuItem.price}
          onChange={e => setMenuItem({ ...menuItem, price: parseFloat(e.target.value) })}
          className="border p-2 mr-2"
        />
        <button onClick={addMenuItem} className="bg-green-500 text-white px-4 py-2">Add</button>
      </div>
    </div>
  );
}
