import { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Avatar, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { getCarts } from '../../../../services/apis/cartsApi';
import { getManyProducts } from '../../../../services/apis/productsApi';

function Carts() {
    const [carts, setCarts] = useState([]);

    useEffect(() => {
        document.title = 'Carts';
        const fetch = async () => {
            try {
                const cartsRes = await getCarts();

                const cartItems = cartsRes.carts;

                const productsId = cartItems.map((cartItem) => cartItem.productId);

                const productsRes = await getManyProducts(productsId);

                const productList = productsRes.products;

                const quantityMap = cartItems.reduce((acc, cart) => {
                    acc[cart.productId] = cart.quantity;
                    return acc;
                }, {});

                const updatedProducts = productList.map((product) => ({
                    ...product,
                    quantity: quantityMap[product.id] || 0,
                }));
                setCarts(updatedProducts);
            } catch (error) {
                console.log(error);
            }
        };

        fetch();
    }, []);

    return (
        <div className="w-full flex flex-col items-center">
            <Table sx={{ width: "75%" }}>
                {/* Tiêu đề */}
                <TableHead>
                    <TableRow>
                        <TableCell><Checkbox/></TableCell>
                        <TableCell>Products</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Total Price</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>

                {/* Nội dung */}
                <TableBody>
                    {carts.map((cart, index) => (
                        <TableRow key={index} hover>
                            <TableCell>
                                <Checkbox />
                            </TableCell>
                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    src={cart.image}
                                    alt={cart.name}
                                    variant="square"
                                    sx={{ width: 50, height: 50 }}
                                />
                                <div>
                                    <Typography variant="body1" fontWeight="bold">
                                        {cart.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {cart.title}
                                    </Typography>
                                </div>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="body1">{cart.price}&#36;</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="body1">x{cart.quantity}</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="body1" fontWeight="bold">
                                    {(cart.price * cart.quantity).toFixed(2)}&#36;
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <IconButton onClick={() => handleRemove(cart.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Carts;
