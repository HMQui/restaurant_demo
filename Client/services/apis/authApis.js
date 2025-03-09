import axios from 'axios'
import dayjs from 'dayjs';

import { SERVER_URL } from '../../config/globalVariables'

async function loginSuccess(userId) {
    try {
        const response = await axios.post(`${SERVER_URL}/auth/login-success`, {
            id: userId
        });

        return response.data.token;
    } catch (error) {
        console.error("Login API Error:", error.response?.data || error.message);
        return null;
    }
}

async function isLoggedIn() {
    try {
        const response = await axios.get(`${SERVER_URL}/auth/check`, {
            withCredentials: true
        });

        return response.data.loggin;
    } catch (error) {
        console.error("Check Logg In API Error:", error.response?.data || error.message);
        return false;
    }
}

async function localLogin(username, password) {
    try {
        const response = await axios.post(`${SERVER_URL}/auth/local`, {
            username,
            password,
        }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Local Login API Error:", error.response?.data || error.message);
        return false;
    }
}

async function logOut() {
    try {
        await axios.post(`${SERVER_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

async function createNewUser(data) {
    try {
        if (data.dateOfBirth) {
            // Convert to "YYYY-MM-DD" format before sending to the server
            data.dateOfBirth = dayjs(data.dateOfBirth).format('YYYY-MM-DD');
        }
        let res = await axios.post(`${SERVER_URL}/auth/register`, { newUser: data })

        return res.data
    } catch (error) {
        console.log('Something wrong when calling create new user:', error);
    }
}

async function requestResetPassword(email) {
    try {
        const res = await axios.post(`${SERVER_URL}/auth/request-reset-password`, { email })

        return res.data
    } catch (error) {
        console.log('Something wrong when calling create new user:', error);
        return { error: 1, message: 'Server is broken!' }
    }
}

async function verifySecretCode(secretCode, email) {
    try {
        const res = await axios.post(`${SERVER_URL}/auth/verify-secret-code`, { secretCode, email })

        return res.data
    } catch (error) {
        console.log('Something wrong when calling create new user:', error);
        return { error: 1, message: 'Server is broken!' }
    }
}

async function resetPassword(email, password) {
    try {
        const res = await axios.post(`${SERVER_URL}/auth/reset-password`, { email, password })

        return res.data
    } catch (error) {
        console.log('Something wrong when calling create new user:', error);
        return { error: 1, message: 'Server is broken!' }
    }
}

export { 
    loginSuccess,
    isLoggedIn,
    localLogin,
    logOut,
    createNewUser,
    requestResetPassword,
    verifySecretCode,
    resetPassword 
}
