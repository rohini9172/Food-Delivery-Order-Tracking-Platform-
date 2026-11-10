import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const EMPTY_R = { name: "", imageUrl: "" };
const EMPTY_M = { name: "", price: "", imageUrl: "" };

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Restaurant form state
  const [rForm, setRForm] = useState(EMPTY_R);
  const [editingR, setEditingR] = useState(null); // restaurant object being edited

  // Menu item form state
  const [mForm, setMForm] = useState(EMPTY_M);
  const [editingM, setEditingM] = useState(null); // { restaurantId, item }
  const [addingMenuFor, setAddingMenuFor] = useState(null); // restaurantId

  const loadRestaurants = useCallback(() =>
    api.get("/api/restaurants").then(r => setRestaurants(r.data)), []);

  useEffect(() => { loadRestaurants(); }, [loadRestaurants]);

  // ── Restaurant CRUD ──────────────────────────────────────────
  const submitRestaurant = async (e) => {
    e.preventDefault();
    try {
      if (editingR) {
        await api.put(`/api/restaurants/${editingR.id}`, rForm);
        toast.success("Restaurant updated.");
      } else {
        await api.post("/api/restaurants", rForm);
        toast.success("Restaurant added.");
      }
      setRForm(EMPTY_R); setEditingR(null);
      loadRestaurants();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to save restaurant.");
    }
  };

  const startEditR = (r) => {
    setEditingR(r);
    setRForm({ name: r.name, imageUrl: r.imageUrl ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteRestaurant = async (r) => {
    if (!confirm(`Delete "${r.name}" and all its menu items?`)) return;
    try {
      await api.delete(`/api/restaurants/${r.id}`);
      toast.success("Restaurant deleted.");
      loadRestaurants();
    } catch {
      toast.error("Could not delete restaurant.");
    }
  };

  // ── Menu item CRUD ───────────────────────────────────────────
  const submitMenuItem = async (e) => {
    e.preventDefault();
    const payload = { name: mForm.name, price: parseFloat(mForm.price), imageUrl: mForm.imageUrl || null };
    try {
      if (editingM) {
        await api.put(`/api/restaurants/${editingM.restaurantId}/menu/${editingM.item.id}`, payload);
        toast.success("Menu item updated.");
      } else {
        await api.post(`/api/restaurants/${addingMenuFor}/menu`, payload);
        toast.success("Menu item added.");
      }
      setMForm(EMPTY_M); setEditingM(null); setAddingMenuFor(null);
      loadRestaurants();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to save menu item.");
    }
  };

  const startEditM = (restaurantId, item) => {
    setEditingM({ restaurantId, item });
    setAddingMenuFor(null);
    setMForm({ name: item.name, price: String(item.price), imageUrl: item.imageUrl ?? "" });
  };

  const deleteMenuItem = async (restaurantId, item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await api.delete(`/api/restaurants/${restaurantId}/menu/${item.id}`);
      toast.success("Menu item deleted.");
      loadRestaurants();
    } catch {
      toast.error("Could not delete menu item.");
    }
  };

  const cancelForms = () => {
    setRForm(EMPTY_R); setEditingR(null);
    setMForm(EMPTY_M); setEditingM(null); setAddingMenuFor(null);
  };

  const isMenuFormOpen = editingM !== null || addingMenuFor !== null;

  return (
    <div className="page-root">
      <section className="section">
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* ── Restaurant form ── */}
        <div className="admin-card">
          <h2 className="admin-card-title">
            {editingR ? `Edit — ${editingR.name}` : "Add Restaurant"}
          </h2>
          <form onSubmit={submitRestaurant} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-field">
                <label>Restaurant name *</label>
                <input required minLength={2} maxLength={100} placeholder="e.g. Pizza Corner"
                  value={rForm.name} onChange={e => setRForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Image URL</label>
                <input placeholder="https://…" value={rForm.imageUrl}
                  onChange={e => setRForm(f => ({ ...f, imageUrl: e.target.value }))} />
              </div>
            </div>
            {rForm.imageUrl && (
              <img src={rForm.imageUrl} alt="preview" className="admin-img-preview"
                onError={e => { e.currentTarget.style.display = "none"; }} />
            )}
            <div className="admin-form-actions">
              <button type="submit" className="btn-primary">
                {editingR ? "Save changes" : "Add restaurant"}
              </button>
              {editingR && <button type="button" className="btn-ghost" onClick={cancelForms}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* ── Menu item form ── */}
        {isMenuFormOpen && (
          <div className="admin-card">
            <h2 className="admin-card-title">
              {editingM
                ? `Edit item — ${editingM.item.name}`
                : `Add menu item to ${restaurants.find(r => r.id === addingMenuFor)?.name}`}
            </h2>
            <form onSubmit={submitMenuItem} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Item name *</label>
                  <input required minLength={2} maxLength={100} placeholder="e.g. Margherita Pizza"
                    value={mForm.name} onChange={e => setMForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label>Price (₹) *</label>
                  <input required type="number" min="0.01" step="0.01" placeholder="299"
                    value={mForm.price} onChange={e => setMForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label>Image URL</label>
                  <input placeholder="https://…" value={mForm.imageUrl}
                    onChange={e => setMForm(f => ({ ...f, imageUrl: e.target.value }))} />
                </div>
              </div>
              {mForm.imageUrl && (
                <img src={mForm.imageUrl} alt="preview" className="admin-img-preview"
                  onError={e => { e.currentTarget.style.display = "none"; }} />
              )}
              <div className="admin-form-actions">
                <button type="submit" className="btn-primary">
                  {editingM ? "Save changes" : "Add item"}
                </button>
                <button type="button" className="btn-ghost" onClick={cancelForms}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Restaurant list ── */}
        <h2 className="admin-section-heading">All Restaurants ({restaurants.length})</h2>
        {restaurants.length === 0 ? (
          <p className="empty-msg">No restaurants yet.</p>
        ) : (
          <div className="admin-restaurant-list">
            {restaurants.map(r => (
              <div key={r.id} className="admin-r-card">
                {/* Header row */}
                <div className="admin-r-header">
                  <div className="admin-r-header-left">
                    {r.imageUrl && (
                      <img src={r.imageUrl} alt={r.name} className="admin-r-thumb"
                        onError={e => { e.currentTarget.style.display = "none"; }} />
                    )}
                    <div>
                      <h3 className="admin-r-name">{r.name}</h3>
                      <p className="admin-r-meta">{r.menuItems?.length ?? 0} menu items</p>
                    </div>
                  </div>
                  <div className="admin-r-actions">
                    <button className="btn-sm-primary" onClick={() => startEditR(r)}>Edit</button>
                    <button className="btn-sm-success"
                      onClick={() => { setAddingMenuFor(r.id); setEditingM(null); setMForm(EMPTY_M); setExpandedId(r.id); }}>
                      + Item
                    </button>
                    <button className="btn-sm-danger" onClick={() => deleteRestaurant(r)}>Delete</button>
                    <button className="btn-sm-ghost"
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                      {expandedId === r.id ? "Hide menu ▲" : "Show menu ▼"}
                    </button>
                  </div>
                </div>

                {/* Menu items */}
                {expandedId === r.id && (
                  <div className="admin-menu-list">
                    {(r.menuItems ?? []).length === 0 ? (
                      <p className="admin-menu-empty">No items yet.</p>
                    ) : (
                      r.menuItems.map(item => (
                        <div key={item.id} className="admin-menu-item">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="admin-menu-thumb"
                              onError={e => { e.currentTarget.style.display = "none"; }} />
                          )}
                          <div className="admin-menu-item-info">
                            <span className="admin-menu-item-name">{item.name}</span>
                            <span className="admin-menu-item-price">₹{item.price}</span>
                          </div>
                          <div className="admin-menu-item-actions">
                            <button className="btn-sm-primary"
                              onClick={() => startEditM(r.id, item)}>Edit</button>
                            <button className="btn-sm-danger"
                              onClick={() => deleteMenuItem(r.id, item)}>Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
