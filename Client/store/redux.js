import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { persistStore } from "redux-persist";

import rootReducer from "./reducers/rootReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reduxStore = () => {
    const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
    const persistor = persistStore(store); // Persistor instance

    return { store, persistor };
};

export default reduxStore;
