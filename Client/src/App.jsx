import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import LayOut from './components/LayOut/LayOut';
import {
    Home,
    Login,
    LoginSuccess,
    UserProfile,
    SignUp,
    ForgotPassword,
    ResetPassword,
    Reservation,
    AdminReservation,
    OrderOnline,
    ManageProducts,
    Carts,
} from './components';
import GuestRoute from './components/ProtectedRoute/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/ProtectedRoute/AdminRoute';
import UserRoute from './components/ProtectedRoute/UserRoute';
import RootRoute from './components/ProtectedRoute/RootRoute';

import { isLoggedIn } from '../services/apis/authApis';
import authAction from '../store/actions/authAction';
import typesAction from '../store/actions/typesAction';
import infoUserAction from '../store/actions/infoUserAction';
import updateQuanityCartsAction from '../store/actions/updateQuanityCartsAction';
import { getCarts } from '../services/apis/cartsApi';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const userInfo = useSelector((state) => state.infoUser); // Đúng
    const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await isLoggedIn();
                if (res) {
                    dispatch(authAction(typesAction.LOGIN));
                    dispatch(infoUserAction());
                } else {
                    dispatch(authAction(typesAction.LOGOUT));
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
                dispatch(authAction(typesAction.LOGOUT));
            } finally {
                setLoading(false); // Khi xác thực xong, bỏ trạng thái loading
            }
        };

        const fetch = async () => {
            try {
                const res = await getCarts();
                const carts = res.carts;
                const quantity = carts.reduce((total, cart) => total + cart.quantity, 0);

                dispatch(updateQuanityCartsAction(typesAction.UPDATE_QUANITY_CARTS, quantity));
            } catch (error) {
                console.log(error);
            }
        };

        fetch();

        fetchAuthStatus();
    }, [dispatch]);

    useEffect(() => {
        if (!loading && isAuthenticated && userInfo?.role === 'admin') {
            if (window.location.pathname === '/admin/user-profile') {
                navigate('/admin', { replace: true });
            }
        }
    }, [loading, isAuthenticated, userInfo?.role, navigate]);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/login-success" element={<LoginSuccess />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* User Route */}
            <Route element={<LayOut />}>
                <Route path="/" element={<Home />} />
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    {/* UserRoute */}
                    <Route element={<UserRoute />}>
                        <Route path="/reservation" element={<Reservation />} />
                        <Route path="/order-online" element={<OrderOnline />} />
                        <Route path="/carts" element={<Carts />} />
                    </Route>

                    {/* Admin Route */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<Home />} />
                        <Route path="/admin/reservation" element={<AdminReservation />} />
                        {/* Root Route */}
                        <Route element={<RootRoute />}>
                            <Route path="/admin/manage-products" element={<ManageProducts />} />
                        </Route>
                    </Route>
                    <Route path="/user-profile" element={<UserProfile />} />
                </Route>
            </Route>

            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    );
}

export default App;
