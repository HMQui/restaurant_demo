import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import MainLogo from '../../assets/images/MainLogo.png';
import NoAvatar from '../../assets/images/NoAvatar.png';

function Header() {
    const navigate = useNavigate();
    const currentPage = useLocation();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const { avatar, role } = useSelector((state) => state.infoUser);

    return (
        <>
            {role !== 'admin' ? (
                <div className="px-[190px] w-full h-[84px] bg-base-1 flex flex-row justify-between">
                    <div className="flex flex-row justify-start items-center">
                        <Link to="/" className="flex">
                            <img src={MainLogo} alt="" className="w-24 bg-cover" />
                        </Link>
                    </div>
                    <div className="pb-5 flex flex-row justify-center items-center gap-8 text-lg font-semibold">
                        <button value="home" className={`${currentPage.pathname === '/' && 'text-accent-1'}`}>
                            <Link to="/">Home</Link>
                        </button>
                        <button
                            value="reservation"
                            className={`${currentPage.pathname === '/reservation' && 'text-accent-1'}`}
                        >
                            <Link to="/reservation">Reservation</Link>
                        </button>
                        <button
                            value="order-online"
                            className={`${currentPage.pathname === '/order-online' && 'text-accent-1'}`}
                        >
                            <Link to="/order-online">Order Online</Link>
                        </button>
                        <button
                            value="more"
                            className={`${currentPage.pathname === '/more' && 'text-accent-1'}`}
                        >
                            <Link to="/more">More</Link>
                        </button>
                    </div>
                    <div className="mt-5 flex flex-row justify-center items-center gap-8">
                        <IconButton>
                            <Badge badgeContent={2} color="primary">
                                <ShoppingCartIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                        {isLoggedIn ? (
                            <IconButton disableRipple onClick={() => navigate('/user-profile')}>
                                <img src={avatar || NoAvatar} alt="User" className="mb-3 w-10 h-10 rounded-full" />
                            </IconButton>
                        ) : (
                            <Link to="/login" className="ml-5 underline text-lg hover:text-accent-1">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <div className="px-[190px] w-full h-[84px] bg-base-1 flex flex-row justify-between">
                    <div className="flex flex-row justify-start items-center">
                        <Link to="/admin" className="flex">
                            <img src={MainLogo} alt="" className="w-24 bg-cover" />
                        </Link>
                        <h1 className="text-xl font-bold">This is Admin Role</h1>
                    </div>
                    <div className="pb-5 flex flex-row justify-center items-center gap-8 text-lg font-semibold">
                        <button value="home" className={`${(currentPage.pathname === '/admin' || currentPage.pathname === '/') && 'text-accent-1'}`}>
                            <Link to="/admin">Home</Link>
                        </button>
                        <button
                            value="reservation"
                            className={`${currentPage.pathname === '/admin/reservation' && 'text-accent-1'}`}
                        >
                            <Link to="/admin/reservation">Reservation</Link>
                        </button>
                        <button
                            value="order-online"
                            className={`${currentPage.pathname === '/admin/order-online' && 'text-accent-1'}`}
                        >
                            <Link to="/admin/order-online">Order Online</Link>
                        </button>
                        <button
                            value="manage-products"
                            className={`${currentPage.pathname === '/admin/manage-products' && 'text-accent-1'}`}
                        >
                            <Link to="/admin/manage-products">Manage Products</Link>
                        </button>
                    </div>
                    <div className="mt-5 flex flex-row justify-center items-center gap-8">
                        <IconButton>
                            <Badge badgeContent={2} color="primary">
                                <ShoppingCartIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                        {isLoggedIn ? (
                            <IconButton disableRipple onClick={() => navigate('/user-profile')}>
                                <img src={avatar || NoAvatar} alt="User" className="mb-3 w-10 h-10 rounded-full" />
                            </IconButton>
                        ) : (
                            <Link to="/login" className="ml-5 underline text-lg hover:text-accent-1">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
