import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const FALLBACK_RESTAURANT = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop";
const FALLBACK_ITEM = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop";

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [adding, setAdding] = useState(null);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/restaurants/${id}`)
      .then(res => { setRestaurant(res.data); setError(""); })
      .catch(() => setError("Could not load this restaurant. Please try again."));
  }, [id]);

  const addToCart = async (item) => {
    if (!user) { navigate("/login", { state: { from: location } }); return; }
    setAdding(item.id);
    try {
      await api.post("/api/cart/items", { menuItemId: item.id, quantity: 1 });
      toast.success(`${item.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Could not add item to cart.");
    } finally {
      setAdding(null);
    }
  };

  if (error) return <p className="page-error" role="alert">{error}</p>;
  if (!restaurant) return <div className="page-loading">Loading menu...</div>;

  return (
    <div className="page-root">
      {/* Restaurant hero banner */}
      <div className="restaurant-hero">
        <img
          src={restaurant.imageUrl || FALLBACK_RESTAURANT}
          alt={restaurant.name}
          className="restaurant-hero-img"
          onError={e => { e.currentTarget.src = FALLBACK_RESTAURANT; }}
        />
        <div className="restaurant-hero-overlay">
          <h1 className="restaurant-hero-title">{restaurant.name}</h1>
          <p className="restaurant-hero-sub">{restaurant.menuItems?.length ?? 0} items on the menu</p>
        </div>
      </div>

      {/* Menu grid */}
      <section className="section">
        <h2 className="section-title">Menu</h2>
        {restaurant.menuItems.length === 0 ? (
          <p className="empty-msg">No menu items yet.</p>
        ) : (
          <div className="menu-grid">
            {restaurant.menuItems.map(item => (
              <div key={item.id} className="menu-card">
                <div className="menu-card-img-wrap">
                  <img
                    src={item.imageUrl || FALLBACK_ITEM}
                    alt={item.name}
                    className="menu-card-img"
                    onError={e => { e.currentTarget.src = FALLBACK_ITEM; }}
                  />
                </div>
                <div className="menu-card-body">
                  <h3 className="menu-card-name">{item.name}</h3>
                  <p className="menu-card-price">₹{item.price}</p>
                  <button
                    className="menu-card-btn"
                    onClick={() => addToCart(item)}
                    disabled={adding === item.id}
                  >
                    {adding === item.id ? "Adding…" : "+ Add to cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
