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

            const eventsData = { entityConfig: entityUtil.eventConfig };
            console.log("EVENTS DATA: ", eventsData);
            return {
                ...state, addNew: true, managedEntity: action.payload.entity,
                entitiesData: eventsData
            };
        case types.RESET_MANAGEMENT_PAGE:

            return initState;
        case types.SET_ENTITY_CONFIG:
            const entitiesData = state.entitiesData;

            entitiesData.entityConfig = action.payload.entityConfig;
            entitiesData.entities = [];

            return { ...state, entitiesData: entitiesData };
        default:
            return state;
    }
}

export default reducer;