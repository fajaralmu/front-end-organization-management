import * as types from './types'

export const initState = {
    catalogData: {},
    entities: [],
    entity: {},
    categories: [],
    suppliersData: [], 
    messages: null,
    userAlias: "anonymous_" + new Date().getTime(),
    cart: []

};

export const reducer = (state = initState, action) => {
    switch (action.type) {  
        case types.REMOVE_SHOP_ENTITY:
            return { ...state, entity: action.payload  /*null*/ };   
        case types.SEND_MESSAGE:
            return { ...state, messages: action.payload.entities, userAlias: action.payload.username };
        case types.STORE_MESSAGE:
            return { ...state, messages: action.payload.entities };
        case types.GET_MESSAGE:
            return { ...state, messages: action.payload.entities }; 
        default:
            return state;
    }
}

export default reducer;