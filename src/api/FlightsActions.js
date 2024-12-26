import { fetchFlights } from './FlightsAPI'
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

export const fetchAllFlights = (day) => (dispatch) => {
    dispatch(getFlights())
    return fetchFlights(day)
        .then((flights) => {
            dispatch(getFlightsSuccess(flights))
        })
        .catch((error) => dispatch(getFlightsError(error)))
}
