import { Navigate } from "react-router-dom";
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" />;
  }
  try {
  const base64Payload = token.split(".")[1];
  if (!base64Payload) throw new Error();
  let payload;
try {
  payload = JSON.parse(atob(base64Payload));
} catch {
  localStorage.clear();
  return <Navigate to="/login" />;
}
  const now = Date.now() / 1000;
  if (payload.exp < now) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }
} catch (error) {
  localStorage.clear();
  return <Navigate to="/login" />;
}
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" />;
  }
  return children;
}
export default ProtectedRoute;