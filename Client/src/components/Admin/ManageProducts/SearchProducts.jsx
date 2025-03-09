import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { searchProducts } from '../../../../services/apis/productsApi';
import EditProducts from './EditProducts';

function SearchProducts() {
    const [searchInput, setSearchInput] = useState({
        id: '',
        name: '',
        price: '',
        category: '',
    });
    const [dataRes, setDataRes] = useState([])

    const handleSearchProducts = () => {
        if (!searchInput.id.trim() && !searchInput.name.trim() && !searchInput.price.trim() && !searchInput.category.trim())
            return;
        
        const fetch = async () => {
            try {
                const res = await searchProducts(searchInput);                
                setDataRes(res.products)
            } catch (error) {
                console.log("Something wrong when search products", error);
            }
        }
        fetch()
    }    
    return (
        <div className="w-full flex flex-col justify-start items-center gap-10">
            <h1 className="text-3xl font-bold">Edit Products</h1>
            <div className="w-full flex flex-row justify-between items-center gap-5">
                <TextField
                    fullWidth
                    size="small"
                    label="ID"
                    value={searchInput.id}
                    onChange={(e) => setSearchInput((prev) => ({ ...prev, id: e.target.value }))}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="Name"
                    value={searchInput.name}
                    onChange={(e) => setSearchInput((prev) => ({ ...prev, name: e.target.value }))}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="Price"
                    value={searchInput.price}
                    onChange={(e) => setSearchInput((prev) => ({ ...prev, price: e.target.value }))}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="Category"
                    value={searchInput.category}
                    onChange={(e) => setSearchInput((prev) => ({ ...prev, category: e.target.value }))}
                />
                <Button variant="contained" sx={{ width: '400px' }} endIcon={<SearchIcon />} onClick={handleSearchProducts} >
                    Search
                </Button>
            </div>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6'>
                {dataRes && dataRes.map((product, index) => <EditProducts key={index} dataRender={product}/>)}
            </div>
        </div>
    );
}

export default SearchProducts;
