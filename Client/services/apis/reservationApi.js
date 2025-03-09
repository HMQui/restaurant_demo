import axios from "axios";
import { SERVER_URL } from "../../config/globalVariables";

const createReservation = async (orderData) => {
    try {
        const response = await axios.post(
            `${SERVER_URL}/reservation/create`,
            { orderData },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw error;
    }
}

const cancelReservation = async (id) => {
    try {
        const response = await axios.post(
            `${SERVER_URL}/reservation/cancel`,
            { id },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw error;
    }
}

const getUserReservations = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}/reservation/user-reservations`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log(error);
        console.error(error.response ? error.response.data : error.message);
        throw error;
    }
};

const searchReservations = async (filters) => {
    try {
        const response = await axios.get(`${SERVER_URL}/reservation/search`, {
            params: filters,
            withCredentials: true,
        });        
        return response.data;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw error;
    }
};

const updateReservationStatus = async (orderData, status) => {
    try {
        const response = await axios.post(
            `${SERVER_URL}/reservation/update-status`,
            { orderData, status },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw error;
    }
}

const deleteReservation = async (id) => {
    try {
        const response = await axios.post(
            `${SERVER_URL}/reservation/delete`,
            { id },
            { withCredentials: true }
        );
        return response.data
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw error;
    }
}

const updateServedStatus = async (id, served) => {
    try {
        const response = await axios.post(
            `${SERVER_URL}/reservation/update-served`,
            { id, served },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw error;
    }
}

export { 
    createReservation, 
    cancelReservation, 
    getUserReservations, 
    searchReservations, 
    updateReservationStatus,
    deleteReservation,
    updateServedStatus,
};
