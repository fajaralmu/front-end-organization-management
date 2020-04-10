import * as types from './types'
import * as config from '../utils/WebConfig'
import * as url from '../constant/Url'

const hostCloud = url.hostCloud+"/api/";
const hostLocal = url.hostLocal+"/api/";

const usedHost = () => {
    if (config.debugMode() == true)
        return hostLocal;
    else
        return hostCloud;
} 
const apiBaseUrl  = () => usedHost() + "public/";
const apiEntityBaseUrl  = () => usedHost() + "management/"
const apiAccount = () => usedHost() + "account/"
const apiAdmin = () => usedHost() + "admin/" 
const apiMessage = () => usedHost() + "message/" 
const apiLiveStreaming = () => usedHost() + "livestreaming/" 
export const addEventFromTimeline = (day,month,year) => {
    return { type: types.ADD_EVENT_FROM_TIMELINE, payload: {
        day:day,
        month:month,
        year:year
    }, meta: { type: types.ADD_EVENT_FROM_TIMELINE } };
}

export const setEntityConfig = (entityConfig) => {
    return { 
        type: types.SET_ENTITY_CONFIG,
        payload: {  entityConfig : entityConfig  }, 
        meta: { type: types.SET_ENTITY_CONFIG } };
}
 
export const resetManagementPage = () => {
    return {
        type: types.RESET_MANAGEMENT_PAGE,
        payload: {},
        meta: { type: types.RESET_MANAGEMENT_PAGE }
    };
}

export const removeManagedEntity = () => {
    return {
        type: types.REMOVE_MANAGED_ENTITY,
        payload: {},
        meta: { type: types.REMOVE_MANAGED_ENTITY }
    };
}

export const updateEntity = (request, referer, callback) => {
    referer.props.app.startLoading();
    let requested = {
        type: types.UPDATE_ENTITY,
        payload: {
            entity: request.entityName
        },
        meta: {
            type: types.UPDATE_ENTITY,
            url: request.isNewRecord ? apiEntityBaseUrl().concat("add") : apiEntityBaseUrl().concat("update"),
            app: referer.props.app,
            callback: callback,
            referer: referer
        }
    };
    requested.payload[request.entityName] = request.entity;
    return requested;
}

export const getEntitiesWithCallback = (request, referer, callback) => {
    referer.props.app.startLoading();
    let requested = {
        type: types.GET_ENTITY_WITH_CALLBACK,
        payload: {
            entity: request.entityName,
            filter: {
                limit: 10,
                fieldsFilter: {},
                entryPoint:"inputField"
            }
        },
        meta: {
            type: types.GET_ENTITY_WITH_CALLBACK,
            url: apiEntityBaseUrl().concat("get"),
            app: referer.props.app,
            referer: referer,
            callback: callback
        }
    };
    requested.payload.filter.fieldsFilter[request.fieldName] = request.fieldValue;
    return requested;
}

export const getEntityById = (name, id, app) => {
    app.startLoading();
    let requested = {
        type: types.GET_ENTITY_BY_ID,
        payload: {
            entity: name,
            filter: {
                limit: 1,
                page: 0,
                exacts: true,
                contains: false,
                fieldsFilter: { id: id }
            }
        },
        meta: {
            type: types.GET_ENTITY_BY_ID,
            url: apiEntityBaseUrl().concat("get"),
            app: app
        }
    };
    return requested;
}

export const getEntityList = (request, app) => {
    app.startLoading();
    let requested = {
        type: types.GET_ENTITY,
        payload: {
            entity: request.entityName,
            filter: {
                limit: request.limit,
                page: request.page,
                fieldsFilter: request.fieldsFilter,
                orderBy: request.orderBy,
                orderType: request.orderType,
            },

        },
        meta: {
            type: types.GET_ENTITY,
            url: apiEntityBaseUrl().concat("get"),
            app: app,
            entityConfig: request.entityConfig
        }
    };
    return requested;
}
 

export const requestAppId = (app) => {
    app.startLoading();
    return {
        type: types.REQUEST_ID,
        payload: {},
        meta: {
            app: app, type: types.REQUEST_ID,
            url: apiBaseUrl().concat("generateappid")
        }
    };
}

export const getMessageList = (app) => {
    app.startLoading();
    return {
        type: types.GET_MESSAGE,
        payload: {},
        meta: {
            type: types.GET_MESSAGE, app: app,
            url: apiMessage().concat("getmessages")
        }
    };
}

export const updateLiveSessions = (session, app) => {
    
    return {
        type: types.UPDATE_SESSIONS,
        payload: {session:session},
        meta: {
            app:app,
            type: types.UPDATE_SESSIONS 
        }
    };
}

export const sendVideoImage = (imageData, requestId, destination, app) => {
    console.log("=========== sendVideoImage"); 

    return {
        type: types.SEND_VIDEO_IMAGE,
        payload: {requestId: requestId,
            destination: destination,
            imageData: imageData},
        meta: { 
            url: apiLiveStreaming().concat("sendimage"),
            type: types.SEND_VIDEO_IMAGE,
            app: app
        }
    };
}

export const storeMessageLocally = (messages) => {

    return {
        type: types.STORE_MESSAGE,
        payload: {
            messages: messages
        },
        meta: {
            type: types.STORE_MESSAGE,
        }
    };
}

export const sendChatMessage = (message, username, receiver, app) => {
    app.startLoading();
    return {
        type: types.SEND_MESSAGE,
        payload: {
            message:{
                receiver:receiver,
                text:message
            }, 
            username: username, 
        },
        meta: {
            app: app,
            type: types.SEND_MESSAGE,
            url: apiMessage().concat("sendmessage")
        }
    };
}

export const getAvailableSessions = ( app) => {
    app.startLoading();
    return {
        type: types.GET_SESSIONS,
        payload: { },
        meta: {
            app: app,
            type: types.GET_SESSIONS,
            url: apiMessage().concat("getsessions")
        }
    };
}


export const getEventByDate = (month, year, app) => {
    app.startLoading();
    return {
        type: types.GET_EVENTS_BY_DATE,
        payload: { year: year, month: month },
        meta: {
            app: app, type: types.GET_EVENTS_BY_DATE,
            url: apiAdmin().concat("event")
        }
    };
}
export const selectDivision = (id, app) => {
    app.startLoading();
    return {
        type: types.SELECT_DIVISION,
        payload: { divisionId: id },
        meta: {
            app: app, type: types.SELECT_DIVISION, url: apiAccount().concat("setdivision")
        }
    };
}
 

export const performLogout = (app) => {
    app.startLoading();
    let loginRequest = {
        type: types.DO_LOGOUT,
        payload: {},
        meta: { app: app, type: types.DO_LOGOUT, url: apiAccount().concat("logout") }
    };
    return loginRequest;
}
///ok
export const performLogin = (username, password, app) => {
    app.startLoading();
    let loginRequest = {
        type: types.DO_LOGIN,
        payload: {
            user: { username: username, password: password }
        },
        meta: { type: types.DO_LOGIN, url: apiAccount().concat("login"), app: app }
    };
    return loginRequest;
}

export const refreshLoginStatus = (loginStatus) => {

    let loginRequest = {
        type: types.REFRESH_LOGIN,
        payload: {loginStatus:loginStatus},
        meta: { type: types.REFRESH_LOGIN }
    };
    return loginRequest;
}

//ok
export const getDivisons = (app) => {
    app.startLoading();
    let loginRequest = {
        type: types.GET_DIVISIONS,
        payload: {

        },
        meta: { type: types.GET_DIVISIONS, url: apiAccount().concat("divisions"), app: app }
    };
    return loginRequest;
}
 

export const removeEntity = () => ({
    type: types.REMOVE_SHOP_ENTITY,
    payload: {},
    meta: { type: types.REMOVE_SHOP_ENTITY }
})
 

