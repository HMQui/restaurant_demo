import typesAction from "../actions/typesAction";

const initState = {
    quanity: 0,
};

const updateQuanityCartsReducer = (state = initState, action) => {    
    switch (action.type) {
        case typesAction.INC_QUANITY_CARTS:
            return {
                quanity: state.quanity + action.payload.quanity,
            };
            
        case typesAction.DEC_QUANITY_CARTS:
            return {
                quanity: state.quanity - action.payload.quanity,
            };
        
        case typesAction.UPDATE_QUANITY_CARTS:
            return {
                quanity: action.payload.quanity,
            }
        default:
            return state;
    }
};

export default updateQuanityCartsReducer;
