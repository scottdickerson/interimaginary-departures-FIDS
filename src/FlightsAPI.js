import { normalizeFlight } from './dataUtils'
import moment from 'moment'

export const fetchFlights = (minutesToSeparate) =>
    fetch(`${process.env.REACT_APP_SERVER_API_URL}/flights`, {
        method: 'get',
        url: process.env.REACT_APP_SERVER_API_URL,
    }).then((response) => {
        console.log('fetch response')
        return response.json().then((flights) =>
            flights.map((flight, index) => ({
                ...normalizeFlight(flight),
                departureTime: minutesToSeparate
                    ? moment()
                          .add(minutesToSeparate * (index + 1), 'minutes')
                          .valueOf() // fake the minutes}))
                    : moment(flight.departureTime).valueOf(),
            }))
        )
    })
