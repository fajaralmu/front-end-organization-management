import * as shopReducer from "./shopReducer"
import * as userReducer from "./userReducer" 
import * as managementReducer from "./managementReducer"
import * as chatReducer from "./chatReducer"
import { combineReducers } from "redux";

export const rootReducer = combineReducers(
    {
        shopState: shopReducer.reducer,
        userState: userReducer.reducer,
        chatState: chatReducer.reducer,
        managementState: managementReducer.reducer
    }
);

export const initialState = {
    shopState: shopReducer.initState,
    userState: userReducer.initState,
    chatState: chatReducer.initState,
    managementState: managementReducer.initState
}

export default rootReducer;