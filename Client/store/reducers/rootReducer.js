import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

import authReducer from "./authReducer";
import infoUserReducer from "./infoUserReducer";
import updateQuanityCartsReducer from "./updateQuanityCartsReducer";

// Persist config for user info reducer
const commonConfig = {
    storage,
    stateReconciler: autoMergeLevel2
};

const authConfig = {
    ...commonConfig,
    key: 'auth',
}

const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    infoUser: infoUserReducer, // Persisted reducer
    quanity: updateQuanityCartsReducer,
});

export default rootReducer;
