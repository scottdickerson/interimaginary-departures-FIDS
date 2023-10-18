import { fetchFlights } from './FlightsAPI'
import sortBy from 'lodash/sortBy'
export const GET_FLIGHTS_ERROR = 'GET_FLIGHTS_ERROR'
export const GET_FLIGHTS = 'GET_FLIGHTS'
export const GET_FLIGHTS_SUCCESS = 'GET_FLIGHTS_SUCCESS'

export const getFlights = () => ({ type: GET_FLIGHTS })

export const getFlightsError = (error) => ({
    type: GET_FLIGHTS_ERROR,
    payload: error,
})

export const getFlightsSuccess = (data) => ({
    type: GET_FLIGHTS_SUCCESS,
    payload: data,
})

// Returns an array of flights with departureTimes as an array
export const fetchAllFlights = (day) => (dispatch) => {
    dispatch(getFlights())
    return fetchFlights(day)
        .then((response) => {
            const flights = Object.values(
                sortBy(response, ['destination', 'departureTime']).reduce(
                    (acc, nextFlight) => {
                        if (!acc[nextFlight.destination]) {
                            acc[nextFlight.destination] = {
                                ...nextFlight,
                                departureTimes: [nextFlight.departureTime],
                            }
                        } else {
                            acc[nextFlight.destination].departureTimes.push(
                                nextFlight.departureTime
                            )
                        }
                        return acc
                    },
                    {}
                )
            )
            dispatch(getFlightsSuccess(flights))
        })
        .catch((error) => dispatch(getFlightsError(error)))
}
