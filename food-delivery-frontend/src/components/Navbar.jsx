import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="site-nav">
      <Link to="/" className="site-brand" onClick={close}>
        🍕 FoodDelivery
      </Link>

      {/* Hamburger */}
      <button
        className="nav-hamburger"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span /><span /><span />
      </button>

      <div className={`site-nav-links ${open ? "nav-open" : ""}`}>
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link nav-active" : "nav-link"} onClick={close}>
          Restaurants
        </NavLink>

        {user && user.role !== "Admin" && (
          <>
            <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link nav-active" : "nav-link"} onClick={close}>
              🛒 Cart
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link nav-active" : "nav-link"} onClick={close}>
              My Orders
            </NavLink>
          </>
        )}

        {user?.role === "Admin" && (
          <>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "nav-link nav-active" : "nav-link"} onClick={close}>
              📋 All Orders
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link nav-active nav-admin" : "nav-link nav-admin"} onClick={close}>
              ⚙ Admin
            </NavLink>
          </>
        )}

        {user ? (
          <div className="nav-user-group">
            <span className="nav-username">👤 {user.username}</span>
            <button type="button" className="nav-button" onClick={() => { logout(); close(); }}>
              Log out
            </button>
          </div>
        ) : (
          <div className="nav-auth-group">
            <Link to="/login" className="nav-link" onClick={close}>Log in</Link>
            <Link to="/register" className="nav-register" onClick={close}>Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
