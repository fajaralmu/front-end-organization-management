import * as shopReducer from "./shopReducer"
import * as userReducer from "./userReducer" 
import * as managementReducer from "./managementReducer"

import { combineReducers } from "redux";

export const rootReducer = combineReducers(
    {
        shopState: shopReducer.reducer,
        userState: userReducer.reducer,
        
        managementState: managementReducer.reducer
    }
);

export const initialState = {
    shopState: shopReducer.initState,
    userState: userReducer.initState,
    
    managementState: managementReducer.initState
}

export default rootReducer;