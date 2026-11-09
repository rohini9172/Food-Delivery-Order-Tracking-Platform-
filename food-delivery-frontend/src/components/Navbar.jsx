import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="site-nav">
      <Link to="/" className="site-brand">Food Delivery</Link>
      <div className="site-nav-links">
        <Link to="/">Restaurants</Link>
        <Link to="/cart">Cart</Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            <span className="nav-username">{user.username}</span>
            <button type="button" className="nav-button" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="nav-register">Create account</Link>
          </>
        )}
      </div>
    </nav>
  );
}
