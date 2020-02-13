import * as types from './types'
import * as entityUtil from '../utils/EntityConfigurations'

export const initState = {

    entitiesData: {
        entityConfig: null,
    },
    managedEntity: null,
    events: [],
    addNew: false

};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.GET_ENTITY:

            return { ...state, entitiesData: action.payload };
        case types.GET_ENTITY_BY_ID:

            return { ...state, addNew: false, managedEntity: action.payload.entities[0] };
        case types.UPDATE_ENTITY:

            return state;
        case types.REMOVE_MANAGED_ENTITY:

            return { ...state, addNew: false, managedEntity: null };
        case types.GET_EVENTS_BY_DATE:

            if (action.payload.entities)
                return { ...state, events: action.payload.entities };
        case types.ADD_EVENT_FROM_TIMELINE:

            return { ...state, addNew: true, managedEntity: action.payload.entity, entitiesData: { entityConfig: entityUtil.eventConfig } };
        case types.RESET_MANAGEMENT_PAGE:

            return initState;
        default:
            return state;
    }
}

export default reducer;