import {
    GET_FLIGHTS,
    GET_FLIGHTS_ERROR,
    GET_FLIGHTS_SUCCESS,
} from './FlightsActions'

export const flightsReducer = (state = [], action) => {
    switch (action.type) {
        case GET_FLIGHTS:
            return { ...state, isFetching: true, data: null }
        case GET_FLIGHTS_SUCCESS:
            return { ...state, data: action.payload, isFetching: false }
        case GET_FLIGHTS_ERROR:
            return { ...state, error: action.payload, isFetching: false }
        default:
            return state
    }
}
