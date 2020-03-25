import * as types from './types'

export const initState = {
    sessionsMap: [],
    messages: []

};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.GET_SESSIONS:
            return { ...state, sessionsMap: action.payload    };
        case types.GET_MESSAGE:
            return { ...state, messages: action.payload    };
        case types.STORE_MESSAGE:
            return { ...state, messages: action.payload    };
        case types.UPDATE_SESSIONS:
            const sessionsMap = state.sessionsMap;
            sessionsMap.push(action.payload.session);

            console.log("Session map: ",sessionsMap);

            action.payload.app.refresh();

            return {...state, sessionsMap: sessionsMap};
        default:
            return state;
    }
}

export default reducer;