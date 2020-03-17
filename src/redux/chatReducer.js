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
        default:
            return state;
    }
}

export default reducer;