import * as types from './types'
import * as menus from '../utils/HardCodedEntites'
import * as menuCodes from '../constant/Menus'
import { initialState } from './reducers';

export const initState = {
    loginKey: null,
    loginStatus: false,
    loginFailed: false,
    menus: menus.menus,
    loggedUser: null,
    loginAttempt: false,
    divisions: null,
    division: null,
    requestId: null
};

export const reducer = (state = initState, action) => {
    /*
        ========setting menu========
    */
    let updatedMenus = new Array();
    if (action.payload) {

        let loggedIn = action.payload && action.payload.loginStatus == true;
        for (let index = 0; index < menus.menus.length; index++) {
            const menu = menus.menus[index];
            if (loggedIn && menu.code == menuCodes.LOGIN) { continue; }

            if (menu.authenticated == false) {
                updatedMenus.push(menu);
            } else {
                if (loggedIn) { updatedMenus.push(menu); }
            }
        }
    }

    switch (action.type) {
        case types.DO_LOGIN:
            let result = {
                ...state,
                loginAttempt: true,
                loginStatus: action.payload.loginStatus,
                loginKey: action.payload.loginKey,
                loginFailed: action.payload.loginStatus == false,
                menus: updatedMenus,
                loggedUser: action.payload.loggedUser
            };

            if (result.loginStatus == true) {
                localStorage.setItem("loginKey", result.loginKey);
                localStorage.setItem("loggedUser", JSON.stringify(result.loggedUser));
                result.divisions = action.payload.divisions
            }

           
            return result;
        case types.REQUEST_ID:
            result = { ...state, requestId: action.payload.message };

            if (!action.payload.loggedIn) {
                
                result.loginStatus = false;
                result.loggedUser = null;
            }else{
                
                if(action.payload.sessionData){
                    
                    result.division = action.payload.sessionData.division;
                    result.loggedUser = action.payload.sessionData.user;
                }
            }

           
          //  action.payload.referer.refresh();

            return result;
        case types.DO_LOGOUT:
            result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                menus: updatedMenus,
                division:null,
                loggedUser: null
            };
            localStorage.removeItem("loginKey");
            localStorage.removeItem("loggedUser");
            return result;
        case types.REFRESH_LOGIN:

            result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                menus: updatedMenus,
                loggedUser: action.payload.loggedUser
            };


            return result;
        case types.GET_DIVISIONS:
            if(action.payload.invalidSession != true){
                result = {
                    ...state,
                    divisions: action.payload.divisions,
                }; 
            }else{
                result = {
                    ...state,
                    divisions: [],
                    loggedUser: null,
                    loginStatus: false
                };
            }
           
            
            return result;
        case types.SELECT_DIVISION:
            result = {
                ...state,
                division: action.payload.entity,
            };
            return result;
        default:
            if (action.payload && action.payload.loginStatus != null)
                return { ...state, menus: updatedMenus };
            else {
                return { ...state };
            }
    }
}

export default reducer;