import axios from 'axios'

import typesAction from "./typesAction";
import { SERVER_URL } from '../../config/globalVariables'

const infoUserAction = (type = typesAction.UPDATE_USER_INFO, ...info) => async (dispatch) => {
    
    if (type === typesAction.CHANGE_LOCAL_AVATAR)
        return dispatch({
            type: typesAction.CHANGE_LOCAL_AVATAR,
            payload: {
                role: info[0].role,
                avatar: info[0].avatar
            }
        })

    try {
        const response = await axios.get(`${SERVER_URL}/users/info`, { withCredentials: true })        
        
        return dispatch({
            type: typesAction.UPDATE_USER_INFO,
            payload: {
                role: response.data.role,
                avatar: response.data.avatar,
            }
        })
    } catch (error) {
        console.log('Some thing wrong at infoUserAction: ' + error);
        return dispatch({
            type: typesAction.UPDATE_USER_INFO,
            payload: {
                role: null,
                avatar: null,
            }
        })
    }
}

export default infoUserAction;
