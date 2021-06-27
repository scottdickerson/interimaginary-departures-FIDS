import { flightsReducer } from '../FlightsReducer'
import {
    getFlights,
    getFlightsSuccess,
    getFlightsError,
} from '../FlightsActions'

describe('flightsReducer', () => {
    it('GET_FLIGHTS', () =>
        expect(flightsReducer({}, getFlights())).toEqual({
            isFetching: true,
            data: null,
        }))
    it('GET_FLIGHTS_SUCCESS', () => {
        const mockData = []
        expect(flightsReducer({}, getFlightsSuccess(mockData))).toEqual({
            isFetching: false,
            data: mockData,
        })
    })
    it('GET_FLIGHTS_ERROR', () => {
        const error = new Error('Cannot fetch flights')
        expect(flightsReducer({}, getFlightsError(error))).toEqual({
            isFetching: false,
            error: error,
        })
    })
})
