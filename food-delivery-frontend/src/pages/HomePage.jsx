import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    api.get("/api/restaurants").then(res => setRestaurants(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
      <div className="grid grid-cols-2 gap-4">
        {restaurants.map(r => (
          <div key={r.id} className="border p-4">
            <h2 className="text-xl">{r.name}</h2>
            <Link to={`/restaurant/${r.id}`} className="text-blue-500">View Menu</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
