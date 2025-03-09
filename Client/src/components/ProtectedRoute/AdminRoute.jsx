import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminRoute() {
    const role = useSelector((state) => state.infoUser?.role);

    if (!role) {
        return <p>loading...</p>;
    }

    return role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AdminRoute;
