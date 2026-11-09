import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.username.trim().length < 3) {
      setError("Username must contain at least 3 non-space characters.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/api/auth/register", {
        username: form.username.trim(),
        password: form.password,
      });
      toast.success("Registered successfully!");
      navigate("/login", { replace: true, state: { registeredUsername: form.username.trim() } });
    } catch (err) {
      const message = err.response?.data?.message ?? "Could not create your account. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-title">
        <p className="auth-eyebrow">Welcome to Food Delivery</p>
        <h1 id="register-title">Create your account</h1>
        <p className="auth-description">A few details and you can start exploring restaurants.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            minLength={3}
            maxLength={50}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            maxLength={100}
            required
          />

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            maxLength={100}
            required
          />

          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="auth-footer">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
