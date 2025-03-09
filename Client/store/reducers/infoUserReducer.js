import typesAction from "../actions/typesAction";

const initState = {
    role: '',
    avatar: '',
};

const infoUserController = (state = initState, action) => {    
    switch (action.type) {
        case typesAction.UPDATE_USER_INFO:
            return {
                role: action.payload.role,
                avatar: action.payload.avatar,
            };
            
        case typesAction.CHANGE_LOCAL_AVATAR:
            return {
                role: action.payload.role,
                avatar: action.payload.avatar,
            };
            
        default:
            return state;
    }
};

export default infoUserController;
