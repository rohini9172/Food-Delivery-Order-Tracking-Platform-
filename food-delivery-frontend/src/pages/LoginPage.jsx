import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: location.state?.registeredUsername ?? "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/api/auth/login", {
        username: form.username.trim(),
        password: form.password,
      });
      login(response.data.token);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (err) {
      const message = err.response?.data?.message ?? "Could not log in. Check your username and password.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="auth-eyebrow">Good to see you again</p>
        <h1 id="login-title">Log in</h1>
        <p className="auth-description">Sign in to continue to your food orders.</p>
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
            autoComplete="current-password"
            maxLength={100}
            required
          />

          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
