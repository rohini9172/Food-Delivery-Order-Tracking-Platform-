import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/restaurants")
      .then((response) => setRestaurants(response.data))
      .catch((error) => {
        console.error("Could not load restaurants:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading restaurants...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
      {restaurants.length === 0 ? (
        <p>No restaurants available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{restaurant.menuItems?.length ?? 0} menu items</p>
              <Link to={`/restaurant/${restaurant.id}`} className="inline-block mt-3 text-blue-600 font-medium">
                View menu
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
