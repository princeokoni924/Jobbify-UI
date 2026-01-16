import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../content/AuthContext";
import Loading from "../components/LoaderSpinner";

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={`/login`} replace state={{ from: location }} />;
  }

  // Role restriction
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/unauthorized`} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
