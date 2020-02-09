import * as types from './types'

export const initState = {

    entitiesData: {
        entityConfig: null,
    },
    managedEntity: null,
    events: []

};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.GET_ENTITY:

            return { ...state, entitiesData: action.payload };
        case types.GET_ENTITY_BY_ID:

            return { ...state, managedEntity: action.payload.entities[0] };
        case types.UPDATE_ENTITY:

            return state;
        case types.REMOVE_MANAGED_ENTITY:

            return { ...state, managedEntity: null };
        case types.GET_EVENTS_BY_DATE:
            
            if (action.payload.entities)
                return { ...state, events: action.payload.entities };
        default:
            return state;
    }
}

export default reducer;