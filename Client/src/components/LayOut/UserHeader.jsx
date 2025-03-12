import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Button,
    IconButton,
    Badge,
    Popover,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Avatar,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import MainLogo from '../../assets/images/MainLogo.png';
import NoAvatar from '../../assets/images/NoAvatar.png';
import { getCarts } from '../../../services/apis/cartsApi';
import { getManyProducts } from '../../../services/apis/productsApi';

function UserHeader() {
    const navigate = useNavigate();
    const currentPage = useLocation();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const { avatar } = useSelector((state) => state.infoUser);
    const { quanity } = useSelector((state) => state.quanity);
    const [quanityCarts, setQuanityCarts] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [carts, setCarts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const cartsResponse = await getCarts();

            if (cartsResponse.error === 0) {
                const cartItems = cartsResponse.carts;

                const productIds = cartItems.map((cart) => cart.productId);

                const productsResponse = await getManyProducts(productIds);

                if (productsResponse.error === 0) {
                    const productList = productsResponse.products;

                    const quantityMap = cartItems.reduce((acc, cart) => {
                        acc[cart.productId] = cart.quantity;
                        return acc;
                    }, {});

                    const updatedProducts = productList.map((product) => ({
                        ...product,
                        quantity: quantityMap[product.id] || 0,
                    }));

                    setCarts(updatedProducts);
                }
            }
        };

        fetchData();
        setQuanityCarts(quanity);
    }, [quanity]);

    return (
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
                <button value="reservation" className={`${currentPage.pathname === '/reservation' && 'text-accent-1'}`}>
                    <Link to="/reservation">Reservation</Link>
                </button>
                <button
                    value="order-online"
                    className={`${currentPage.pathname === '/order-online' && 'text-accent-1'}`}
                >
                    <Link to="/order-online">Order Online</Link>
                </button>
                <button value="more" className={`${currentPage.pathname === '/more' && 'text-accent-1'}`}>
                    <Link to="/more">More</Link>
                </button>
            </div>
            <div className="mt-5 flex flex-row justify-center items-center gap-8">
                <Box>
                    <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                        <Badge badgeContent={quanityCarts} color="primary">
                            <ShoppingCartIcon fontSize="small" />
                        </Badge>
                    </IconButton>
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        sx={{ padding: '100px' }}
                    >
                        <Box sx={{ paddingY: 2, width: 400, maxHeight: 300 }}>
                            <h3 className="mx-5 mb-3 font-semibold">Your Carts</h3>
                            <hr className="m-0" />
                            <List sx={{ padding: '0px' }}>
                                {carts.map((cart, index) => (
                                    <ListItem
                                        key={index}
                                        className="flex flex-row justify-between items-center border-b hover:bg-base-1 cursor-pointer"
                                        onClick={() => {
                                            navigate("/order-online")
                                            setAnchorEl(null)
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={cart.image} alt={cart.name} variant="rounded" />
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={cart.name}
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="text.primary">
                                                        {cart.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {cart.subTitle}
                                                    </Typography>
                                                </>
                                            }
                                        />

                                        <Typography variant="body2" color="text.primary">
                                            x{cart.quantity}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                            <div className='pb-3 w-full flex justify-end'>
                                <Button variant='contained' sx={{ marginTop: "15px", marginRight: "40px" }}>
                                    <Link to="/carts">Go to your Carts</Link>
                                </Button>
                            </div>
                        </Box>
                    </Popover>
                </Box>

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
    );
}

export default UserHeader;
