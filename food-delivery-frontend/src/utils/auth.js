import { jwtDecode } from "jwt-decode";

const roleClaimUri = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export function getUserFromToken(token) {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role ?? decoded[roleClaimUri];

    if (!decoded.sub || !role || !Number.isFinite(decoded.exp) || decoded.exp * 1000 <= Date.now()) {
      return null;
    }

    return {
      id: decoded.sub,
      username: decoded.unique_name ?? decoded.name ?? "",
      role,
    };
  } catch {
    return null;
  }
}
