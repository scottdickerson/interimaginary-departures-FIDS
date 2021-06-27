import { flightsReducer } from '../src/api/FlightsReducer'
import { combineReducers } from 'redux'

export default combineReducers({
    flights: flightsReducer,
})
