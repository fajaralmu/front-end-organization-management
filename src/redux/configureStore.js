import { createStore, applyMiddleware } from 'redux'
import { initialState, rootReducer } from './reducers'
import * as actionCreator from './actionCreators';
import * as types from './types';
import * as config from '../utils/WebConfig'
import * as stringUtil from '../utils/StringUtil';

const commonAuthorizedHeader = () => {
    return {
        'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId")
    }
};
const POST_METHOD = "POST";
const TIMEOUT = 100000;

export const configureStore = () => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(
            removeEntityMiddleware,

            //user related
            performLoginMiddleware,
            performLogoutMiddleware,
            refreshLoginStatusMiddleware,
            getDivisionsMiddleware,

            //transaction   
            selectDivisionMiddleware,
            getEventByDateMiddleware,
            requestAppIdMiddleware,

            storeChatMessageLocallyMiddleware,
            getMessagesMiddleware,
            sendChatMessageMiddleware,

            /*enntity management*/
            getEntityListMiddleware,
            getEntityByIdMiddleware,
            updateEntityMiddleware,
            removeManagedEntityMiddleware,
            addEventFromTimelineMiddleware,
            resetManagementPageMiddleware,
            setEntityConfigMiddleware,

            getEntitiesWithCallbackMiddleware

        )
    );

    return store;
}

function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error("timeout"))
        }, ms)
        promise.then(resolve, reject)
    })
}

const getEntitiesWithCallbackMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_ENTITY_WITH_CALLBACK) { return next(action); }

    timeout(TIMEOUT,fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    }))
        .then(response => response.json())
        .then(data => {

            data = (data);
            if (data.entities == null || data.entities.length == 0) {
                alert("Data not found!");
                return;
            }

            action.meta.callback(data, action.meta.referer);

            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}

const updateEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.UPDATE_ENTITY) { return next(action); }

    timeout(TIMEOUT,fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    }))
        .then(response => response.json())
        .then(data => {

            data = (data);
            console.debug("Response updateEntityMiddleware:", data);
            if (data.code != "00") {
                alert("Error Update Entity!");
                return;
            }
            alert("Update Success!");
            const callback = action.meta.callback;
            const referer = action.meta.referer;
            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
            callback(referer);
        })
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}

const getEntityByIdMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_ENTITY_BY_ID) { return next(action); }

    timeout(TIMEOUT, fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    }))
        .then(response => response.json())
        .then(data => {

            data = (data);
            console.debug("Response:", data);
            if (data.entities == null || data.entities.length == 0) {
                alert("Data not found!");
                return;
            }
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}

const getEntityListMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_ENTITY) { return next(action); }

    timeout(TIMEOUT,fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    }))
        .then(response => response.json())
        .then(data => {

            data = (data);
            console.debug("Response:", data);
            if (data.entities == null || data.entities.length == 0) {
                data.entitie = [];
            }
            data.entityConfig = action.meta.entityConfig;
            let newAction = Object.assign({}, action, {
                payload: data
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err))
        .finally(param => action.meta.app.endLoading());
}

const getMessagesMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_MESSAGE) { return next(action); }
    timeout(TIMEOUT,fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId") }
    })).then(response => response.json())
        .then(data => {
            console.debug("sendChatMessageMiddleware Response:", data);
            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const sendChatMessageMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.SEND_MESSAGE) { return next(action); }
    timeout(TIMEOUT,fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId") }
    })).then(response => response.json())
        .then(data => {
            console.debug("sendChatMessageMiddleware Response:", data);
            data.username = action.payload.username;
            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const addEventFromTimelineMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.ADD_EVENT_FROM_TIMELINE) { return next(action); }

    let eventEntity = {
        date: stringUtil.dateInputVal(action.payload.day, action.payload.month, action.payload.year)
    };

    let newAction = Object.assign({}, action, { payload: { entity: eventEntity } });
    delete newAction.meta;
    store.dispatch(newAction);
}

const setEntityConfigMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.SET_ENTITY_CONFIG) { return next(action); } 

    let newAction = Object.assign({}, action, { payload: { entityConfig: action.payload.entityConfig } });
    delete newAction.meta;
    store.dispatch(newAction);
}

const storeChatMessageLocallyMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.STORE_MESSAGE) { return next(action); }
    let newAction = Object.assign({}, action, { payload: action.payload });
    delete newAction.meta;
    store.dispatch(newAction);
}

const removeManagedEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REMOVE_MANAGED_ENTITY) { return next(action); }
    let newAction = Object.assign({}, action, { payload: action.payload });
    delete newAction.meta;
    store.dispatch(newAction);
}

const resetManagementPageMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.RESET_MANAGEMENT_PAGE) { return next(action); }
    let newAction = Object.assign({}, action, { payload: action.payload });
    delete newAction.meta;
    store.dispatch(newAction);
}


const requestAppIdMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REQUEST_ID) { return next(action); }

    let headers = commonAuthorizedHeader();

    timeout(TIMEOUT, fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: headers
    })).then(response => response.json())
        .then(data => {
            data = (data);



            console.debug(config.debugMode(), "requestAppIdMiddleware Response:", data);
            if (data.code != "00") {
                alert("Error requesting app ID");
                return;
            }

            data.referer =  action.meta.app;

            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.error(err)).finally(param => action.meta.app.endLoading());
}


const getEventByDateMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_EVENTS_BY_DATE) { return next(action); }

    timeout(TIMEOUT, fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    })).then(response => response.json())
        .then(data => {
            data = (data);

            if (data.code != "00") {
                alert("Server error");
                return;
            }

            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const selectDivisionMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.SELECT_DIVISION) { return next(action); }
    timeout(TIMEOUT,fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    })).then(response => response.json())
        .then(data => {

            data = (data);

            console.debug("selectDivisionMiddleware Response:", data);
            if (data.code != "00") {
                alert("Server error");
                return;
            }

            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const getDivisionsMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_DIVISIONS) { return next(action); }
   
    timeout(TIMEOUT, fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    })).then(response => response.json())
        .then(data => {

            data = (data);

            console.debug("getDivisionsMiddleware Response:", data);
            if (data.code != "00") {
                alert("Server error");
                return;
            }

            if (data.divisions == null) {
                return;
            }

            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}


const performLogoutMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGOUT) {
        return next(action);
    }
    const app = action.meta.app;

    timeout(TIMEOUT,fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    }))
        .then(response => { return Promise.all([response.json(), response]); })
        .then(([responseJson, response]) => {
            responseJson = (responseJson);

            let logoutSuccess = false;
            if (responseJson.code == "00") {
                logoutSuccess = true;
            }

            let newAction = Object.assign({}, action, {
                payload: {
                    loginStatus: !logoutSuccess
                }
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => { console.log(err) })
        .finally(param => app.endLoading());

}

const performLoginMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGIN) {
        return next(action);
    }
    const app = action.meta.app;
    timeout(TIMEOUT,fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: commonAuthorizedHeader()
    }))
        .then(response => { return Promise.all([response.json(), response]); })
        .then(([responseJson, response]) => {

            responseJson = (responseJson);

            let loginKey = "";
            let loginSuccess = false;

            if (responseJson.code != null && responseJson.code == "00") {
                for (var pair of response.headers.entries()) {
                    if (pair[0] == "loginkey") {
                        loginKey = pair[1];
                        break;
                    }
                }

                loginSuccess = true;

            }

            console.log("LOGIN SUCCESS: ", loginSuccess);

            let newAction = Object.assign({}, action, {
                payload: {
                    loginStatus: loginSuccess,
                    loginKey: loginKey,
                    loggedUser: responseJson.user,
                    divisions: responseJson.divisions,
                    division: responseJson.sessionData ? responseJson.sessionData.division : null
                }
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => { console.log(err) })
        .finally(param => app.endLoading());

}

const refreshLoginStatusMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REFRESH_LOGIN) {
        return next(action);
    }

    let loggedUser = null;
    if (localStorage.getItem("loggedUser")) {
        loggedUser = (localStorage.getItem("loggedUser"));
    }

    let newAction = Object.assign({}, action, {
        payload: {
            loginStatus: loggedUser ? true : false,
            loginKey: localStorage.getItem("loginKey"),
            loggedUser: JSON.parse(loggedUser)
        }
    });
    delete newAction.meta;
    store.dispatch(newAction);

}

const removeEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REMOVE_SHOP_ENTITY) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction);

}


export default configureStore;