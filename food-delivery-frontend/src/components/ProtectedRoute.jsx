import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
