import { normalizeFlight } from './dataUtils'
import moment from 'moment'

export const fetchFlights = (minutesToSeparate) =>
    fetch('http://127.0.0.1:8080/flights', {
        method: 'get',
        url: `http://127.0.0.1:8080`,
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
