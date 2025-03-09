import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { searchProducts } from '../../../services/apis/productsApi';

const CATEGORIES = [
    { name: 'Dark Coffee', category: 'DarkCoffee' },
    { name: 'Traditional Coffee', category: 'TraditionalCoffee' },
    { name: 'Milk Coffee', category: 'MilkCoffee' },
    { name: 'Cold Brew & Iced Coffee', category: 'ColdBrewIcedCoffee' },
    { name: 'Fresh Juices', category: 'FreshJuices' },
    { name: 'Matcha Series', category: 'MatchaSeries' },
    { name: 'Classic Tea', category: 'ClassicTea' },
    { name: 'Cakes', category: 'Cakes' },
    { name: 'Cookies & Brownies', category: 'CookiesBrownies' },
];

function OrderOnline() {
    const navigate = useNavigate();
    const [choosedCategory, setChoosedCategory] = useState('DarkCoffee');
    const [products, setProducts] = useState({});

    useEffect(() => {
        const fetchProducts = async (category) => {
            if (!products[category]) {
                try {
                    const res = await searchProducts({ category });
                    setProducts((prev) => ({ ...prev, [category]: res.products }));
                } catch (error) {
                    console.log('Something wrong when fetching products:', error);
                }
            }
        };
        fetchProducts(choosedCategory);
    }, [choosedCategory, products]);

    const handleChangeCategory = (category) => {
        setChoosedCategory(category);
    };

    return (
        <div className="py-20 px-28 w-full min-h-full flex flex-col justify-start items-start">
            <div className="flex flex-row justify-start items-center text-2xl">
                <Button
                    onClick={() => navigate('/')}
                    sx={{ color: 'black', fontWeight: '300', '&:hover': { color: '#035772' } }}
                >
                    Home
                </Button>
                <ArrowForwardIosIcon sx={{ fontSize: '14px' }} />
                <Button sx={{ color: '#035772', fontWeight: '500' }}>Order Online</Button>
            </div>
            <div className="flex flex-col justify-start items-start w-full">
                <h1 className="text-5xl font-bold mt-10">Order Online</h1>
                <p className="text-xl mt-5">Choose a category to start ordering</p>
                <div className="mt-5 w-full bg-gray-100 rounded-2xl flex flex-row justify-start items-center overflow-x-auto whitespace-nowrap flex-nowrap">
                    {CATEGORIES.map((category) => (
                        <Button
                            key={category.category}
                            onClick={() => handleChangeCategory(category.category)}
                            sx={{
                                margin: '10px',
                                backgroundColor: choosedCategory === category.category ? '#035772' : 'transparent',
                                color: choosedCategory === category.category ? 'white' : 'black',
                            }}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products[choosedCategory]?.map((product, index) => (
                        <div key={index} className="flex flex-col justify-start items-start mt-10 group shadow-2xs">
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
                                <p className="text-xl text-accent-1 mt-5">${product.price}</p>
                                <div className='flex flex-row gap-2'>
                                    <Button sx={{ backgroundColor: '#035772', color: 'white', marginTop: '10px' }}>
                                        Add to Cart
                                    </Button>
                                    <Button sx={{ backgroundColor: '#035772', color: 'white', marginTop: '10px' }}>
                                        Order Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OrderOnline;
