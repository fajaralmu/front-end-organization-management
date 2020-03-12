import * as types from './types'

export const initState = {
     availableSessions: []

};

export const reducer = (state = initState, action) => {
    switch (action.type) {  
        case types.GET_SESSIONS:
            return { ...state, availableSessions: action.payload   /*null*/ };    
        default:
            return state;
    }
}

export default reducer;