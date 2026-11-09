import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getUserFromToken } from "../utils/auth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = getUserFromToken(token);

    if (!user) {
      localStorage.removeItem("token");
    }

    return { token: user ? token : null, user };
  });

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
  };

  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, []);

  const login = (jwt) => {
    const user = getUserFromToken(jwt);
    if (!user) {
      throw new Error("The server returned an invalid or expired token.");
    }

    localStorage.setItem("token", jwt);
    setAuth({ token: jwt, user });
  };

  return (
    <AuthContext.Provider value={{ ...auth, isAuthenticated: Boolean(auth.user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
