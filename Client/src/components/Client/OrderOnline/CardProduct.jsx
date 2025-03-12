import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import { updateCarts } from '../../../../services/apis/cartsApi';
import updateQuanityCartsAction from '../../../../store/actions/updateQuanityCartsAction.js';
import typesAction from '../../../../store/actions/typesAction.js';

const notify = (text, type = 'success', hideProgress, timeToClose = 2000) => {
    toast[type](text, {
        position: 'top-right',
        autoClose: timeToClose,
        hideProgressBar: hideProgress,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
    });
};

function CardProduct({ product }) {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        document.title = 'Order Online';
    }, []);

    const handleAddToCart = () => {
        const fetch = async () => {
            try {
                const res = await updateCarts(product.id, quantity, 'inc');

                if (res.error !== 0) {
                    notify(`Something went wrong!`, 'error', true, 2000);
                }
                notify(`${product.name} has been added`, 'success', true, 2000);
                dispatch(updateQuanityCartsAction(typesAction.INC_QUANITY_CARTS, quantity));
            } catch (error) {
                console.log(error);
                notify(`Something went wrong!`, 'error', true, 2000);
                return;
            }
        };

        fetch();
        setQuantity(0);
    };

    return (
        <div className="flex flex-col justify-start items-start mt-10 group shadow-2xs">
            <LazyLoadImage
                src={product.image}
                alt={product.title}
                effect="blur"
                className="w-[306px] h-[175px] object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="w-full flex flex-col justify-start items-start mt-5">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p>{product.title}</p>
                <p className="text-sm line-clamp-2">{product.subTitle}</p>
                <div className="w-full py-3 flex flex-row justify-start items-center gap-8">
                    <p className="text-xl text-accent-1">${product.price}</p>
                    <div className="flex flex-row items-center gap-3">
                        <IconButton onClick={() => setQuantity((prev) => --prev)} disabled={quantity === 0}>
                            <RemoveIcon sx={{ color: quantity === 0 ? 'rgb(202, 206, 211)' : 'red' }} />
                        </IconButton>
                        <span className="text-base-2 font-semibold">{quantity}</span>
                        <IconButton onClick={() => setQuantity((prev) => ++prev)}>
                            <AddIcon color="error" />
                        </IconButton>
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <Button
                        sx={{ backgroundColor: '#035772', color: 'white', marginTop: '10px' }}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                    <Button sx={{ backgroundColor: '#035772', color: 'white', marginTop: '10px' }}>Order Now</Button>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                theme="light"
                transition={Bounce}
            />
        </div>
    );
}

export default CardProduct;

CardProduct.propTypes = {
    product: PropTypes.object,
};
