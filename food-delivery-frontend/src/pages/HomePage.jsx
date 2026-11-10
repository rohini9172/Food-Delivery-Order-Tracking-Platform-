import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const FALLBACK = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/restaurants")
      .then(r => setRestaurants(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-root">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Fresh · Fast · Delicious</p>
          <h1 className="hero-title">Order food you love,<br />delivered to your door</h1>
          <p className="hero-sub">Browse restaurants, build your cart, and track your order live.</p>
          <a href="#restaurants" className="hero-cta">Explore restaurants ↓</a>
        </div>
      </section>

      {/* Restaurant grid */}
      <section id="restaurants" className="section">
        <h2 className="section-title">Restaurants near you</h2>

        {loading ? (
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map(n => <div key={n} className="skeleton-card" />)}
          </div>
        ) : restaurants.length === 0 ? (
          <p className="empty-msg">No restaurants available right now.</p>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map(r => (
              <Link key={r.id} to={`/restaurant/${r.id}`} className="r-card">
                <div className="r-card-img-wrap">
                  <img
                    src={r.imageUrl || FALLBACK}
                    alt={r.name}
                    className="r-card-img"
                    onError={e => { e.currentTarget.src = FALLBACK; }}
                  />
                  <span className="r-card-badge">{r.menuItems?.length ?? 0} items</span>
                </div>
                <div className="r-card-body">
                  <h3 className="r-card-name">{r.name}</h3>
                  <span className="r-card-link">View menu →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
