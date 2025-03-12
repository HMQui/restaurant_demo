import axios from 'axios';

import { SERVER_URL } from '../../config/globalVariables'

const updateCarts = async (productId, quantity, state) => {
    try {
        const res = await axios.post(`${SERVER_URL}/carts/update`, { productId, quantity, state }, { withCredentials: true })
        return res.data
    } catch (error) {
        console.log("Update carts function is broken", error);
    }
}

const getCarts = async () => {
    try {
        const res = await axios.get(`${SERVER_URL}/carts/get`, { withCredentials: true })
        return res.data
    } catch (error) {
        console.log("Update carts function is broken", error);
    }
}

export {
    updateCarts,
    getCarts,
}
