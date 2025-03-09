import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import CreateNewProduct from './CreateNewProduct';
import SearchProducts from './SearchProducts';

function ManageProducts() {
    const navigate = useNavigate();

    return (
        <div className="py-20 px-28 w-full min-h-full flex flex-col justify-start items-start">
            <div className="flex flex-row justify-start items-center text-2xl">
                <Button
                    sx={{
                        color: 'black',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            fontWeight: '500',
                            color: '#035772',
                        },
                        fontWeight: '300',
                    }}
                    onClick={() => navigate('/admin')}
                >
                    Home
                </Button>
                <ArrowForwardIosIcon sx={{ fontSize: '14px' }} />
                <Button
                    sx={{
                        color: '#035772',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        fontWeight: '500',
                    }}
                >
                    Manage Products
                </Button>
            </div>
            <div className=" flex flex-col justify-start items-start w-full">
                <h1 className="text-5xl font-bold mt-10">Manage Products</h1>
                <p className="text-xl mt-3">Create new, Edit or Delete a product here</p>
                {/* <div className="w-screen">
                    <hr className="w-full border border-base-2 my-3 mx-auto" />
                </div> */}

                <CreateNewProduct />

                <SearchProducts />
            </div>
        </div>
    );
}

export default ManageProducts;
