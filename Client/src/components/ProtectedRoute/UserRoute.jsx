import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function UserRoute() {
    const role = useSelector(state => state.infoUser.role);

    if (!role) {
        return <p>loading...</p>;
    }

    return role === "user" ? <Outlet /> : <Navigate to="/admin/home" replace />;
}

export default UserRoute;
