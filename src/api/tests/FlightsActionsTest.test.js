import {
    fetchAllFlights,
    GET_FLIGHTS,
    GET_FLIGHTS_SUCCESS,
    GET_FLIGHTS_ERROR,
} from '../FlightsActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import moment from 'moment'
import { normalizeFlight } from '../dataUtils'

const mockFlights = [
    {
        'Location Name': 'Gramble-Blamble',
        'Category 1': 'Transport',
        'Narrative 1':
            'Flying, flumping, swimming, sailing, waddling, and plunging',
        'Category 2': 'Duration of trip',
        'Narrative 2':
            '14 weeks in a straight line, and 6 weeks in a crooked one',
        'Category 3': 'Atmosphere',
        'Narrative 3': 'Shaded by the blue leaves of the Soffsky-Poffsky trees',
        'Category 4': 'Environment',
        'Narrative 4': 'Home of the great Lake Pipple-Popple',
        'FIDS STATUS': 'On Time',
        'Departure Status': 'Normal',
        Airline: 'AirLinguist',
        'Audiofile Name': '',
        departureTime: '2021-06-26T10:00:00.000Z',
    },
]

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore({})

describe('flightactionstest', () => {
    afterEach(() => {
        fetchMock.reset()
    })
    it('getFlights', () => {
        fetchMock.get(/http:\/\/127.0.0.1:8080.*/, {
            body: mockFlights,
            headers: { 'content-type': 'application/json' },
        })
        store.dispatch(fetchAllFlights()).then(() => {
            expect(store.getActions()).toEqual([
                { type: GET_FLIGHTS },
                {
                    type: GET_FLIGHTS_SUCCESS,
                    payload: mockFlights.map((flight) => ({
                        ...normalizeFlight(flight),
                        departureTime: moment(flight.departureTime).valueOf(),
                    })),
                },
            ])
        })
    })
    it('getFlightsError', () => {
        fetchMock.get(/http:\/\/127.0.0.1:8080.*/, {
            status: 500,
            body: 'Error fetching flights',
            headers: { 'content-type': 'application/json' },
        })
        store.dispatch(fetchAllFlights()).catch((error) => {
            expect(store.getActions()).toEqual([
                { type: GET_FLIGHTS },
                {
                    type: GET_FLIGHTS_ERROR,
                    payload: error,
                },
            ])
        })
    })
})
