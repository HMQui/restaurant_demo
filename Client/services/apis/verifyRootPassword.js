import axios from 'axios';

import { SERVER_URL } from '../../config/globalVariables';

const verifyRootPassword = async (password) => {
    try {
        const res = await axios.post(`${SERVER_URL}/auth/verify-root-password`, { password });
        return res.data;
    } catch (error) {
        console.error('Verify root password failed:', error);
    }
}

export default verifyRootPassword;