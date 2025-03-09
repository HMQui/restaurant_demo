import typesAction from "../actions/typesAction";

const initState = {
    isLoggedIn: false,
}

const authReducer = (state = initState, action) => {    
    switch (action.type) {
        case typesAction.LOGIN:
            return {
                ...state,
                isLoggedIn: action.payload.isLoggedIn,
            }
        case typesAction.LOGOUT:
            return {
                ...state,
                isLoggedIn: action.payload.isLoggedIn,
            }
        default:
            return state;
    }
}

export default authReducer;
