import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";

export default function ProtectedRoute({ children, requiredRole }) {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
