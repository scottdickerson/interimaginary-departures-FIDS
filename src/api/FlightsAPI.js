import { normalizeFlight } from './dataUtils'
import qs from 'qs'

const tzOffset = Intl.DateTimeFormat().resolvedOptions().timeZone

export const fetchFlights = (day) =>
    fetch(
        `${
            process.env.REACT_APP_SERVER_API_URL || 'http://127.0.0.1:8080'
        }/flights?${qs.stringify({ day, tzOffset })}`,
        {
            method: 'get',
            url:
                process.env.REACT_APP_SERVER_API_URL || 'http://127.0.0.1:8080',
        }
    ).then((response) => {
        console.log('fetch response')
        if (response.ok) {
            return response
                .json()
                .then((flights) =>
                    flights.map((flight) => normalizeFlight(flight))
                )
        }
        throw new Error(`Error fetching flights: ${response.body}`)
    })
