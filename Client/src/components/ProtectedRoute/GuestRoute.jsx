import  { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

function GuestRoute() {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)

    return isLoggedIn ? <Navigate to='/' replace /> : <Outlet/>;
}

export default GuestRoute;