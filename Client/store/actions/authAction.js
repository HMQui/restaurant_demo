import typesAction from "./typesAction";

const authAction = (state) => {
    if (state === typesAction.LOGIN)
        return {
            type: typesAction.LOGIN,
            payload: {
                isLoggedIn: true,
            }
        }
    else
        return {
            type: typesAction.LOGOUT,
            payload: {
                isLoggedIn: false,
            }
        }
}

export default authAction;
