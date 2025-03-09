import dayjs from 'dayjs';
import axios from 'axios'

import { SERVER_URL } from '../../config/globalVariables'

async function userInfoFull() {
    try {        
        const res = await axios.get(`${SERVER_URL}/users/info-full`, { withCredentials: true })

        return res.data
    } catch (error) {
        console.log('Something wrong when call users-info-full: ', error);
    }
}

async function updateUserProfile(data) {
    try {
        if (data.dateOfBirth) {
            // Convert to "YYYY-MM-DD" format before sending to the server
            data.dateOfBirth = dayjs(data.dateOfBirth).format('YYYY-MM-DD');
        }
                
        const res = await axios.post(
            `${SERVER_URL}/users/update`,
            { updateData: data },
            { withCredentials: true }
        );

        return res.data;
    } catch (error) {
        console.log('Something wrong when calling update user profile:', error);
    }
}

async function changePassword(currPass, newPass) {
    try {
        const res = await axios.post(`${SERVER_URL}/users/change-password`, { currPass, newPass }, { withCredentials: true })

        return res.data

    } catch (error) {
        console.log('Something wrong when calling change password:', error);
    }
}

const handleUploadAvatar = async (formData) => {
    try {
        const res = await axios.post(
            `${SERVER_URL}/users/update-avatar`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }
        );

        return res.data
    } catch (error) {
        console.error("Upload error:", error);
    }
};

export {
    userInfoFull,
    updateUserProfile,
    changePassword,
    handleUploadAvatar,
}