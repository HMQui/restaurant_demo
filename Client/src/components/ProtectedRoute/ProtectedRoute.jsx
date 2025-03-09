import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
