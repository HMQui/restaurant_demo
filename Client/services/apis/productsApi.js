import axios from 'axios';

import { SERVER_URL } from '../../config/globalVariables'

const createNewProduct = async (newProduct) => {    
    try {
        const res = await axios.post(`${SERVER_URL}/products/create`, { newProduct }, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log('Something wrong when calling search products:', error);
    }
}

const searchProducts = async (searchTerm) => {
    const filteredParams = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(searchTerm).filter(([_, value]) => value !== "")
    );
    try {
        const res = await axios.get(`${SERVER_URL}/products/search`, { 
            params: filteredParams, 
            withCredentials: true 
        });
        return res.data;
    } catch (error) {
        console.log('Something wrong when calling search products:', error);
    }
}

const updateProduct = async (id, changeData) => {    
    try {
        const res = await axios.patch(`${SERVER_URL}/products/update/${id}`, changeData, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error('Error updating product:', error.response?.data || error.message);
        throw error;
    }
};


export {
    searchProducts,
    createNewProduct,
    updateProduct,
}
