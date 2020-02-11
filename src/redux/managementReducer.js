import * as types from './types'
import * as entityUtil from '../utils/EntityConfigurations'

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
        case types.ADD_EVENT_FROM_TIMELINE:

        console.log("PAYLOAD:",action.payload);
            return { ...state, managedEntity: action.payload.entity,entitiesData:{entityConfig:entityUtil.eventConfig} };
        default:
            return state;
    }
}

export default reducer;