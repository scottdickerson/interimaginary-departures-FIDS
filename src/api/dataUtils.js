import moment from 'moment'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'

import airlinguist from '../imgs/AirLinguist.png'
import airudite from '../imgs/Airudite.png'
import arslonga from '../imgs/ArsLonga.png'
import dystopiair from '../imgs/DystopiAir.png'
import gobelow from '../imgs/GoBelow.png'
import gossamerica from '../imgs/GossAmerica.png'
import incorporeal from '../imgs/IncorpoREAL.png'
import janeair from '../imgs/JaneAir.png'
import oddyssey from '../imgs/Oddyssey.png'
import panache from '../imgs/Panache.png'
import quantum from '../imgs/Quantum.png'
import spellbound from '../imgs/SpellboundAirlines.png'
import untitledairlines from '../imgs/UntitledAirlines.png'
import utopiair from '../imgs/UtopiAir.png'
import wistful from '../imgs/Wistful.png'

// audio files
import abame from '../sound/announcement-abame.mp3'
import ankhmorpark from '../sound/announcement-ankhmorpark.mp3'
import asteroidb612 from '../sound/announcement-asteroid612.mp3'
import cimeria from '../sound/announcement-cimeria.mp3'
import cityofbrass from '../sound/announcement-cityofbrass.mp3'
import cyberspace from '../sound/announcement-cyberspace.mp3'

const imagepaths = {
    airlinguist,
    airudite,
    arslonga,
    dystopiair,
    gobelow,
    gossamerica,
    incorporeal,
    janeair,
    oddyssey,
    panache,
    quantum,
    spellbound,
    untitledairlines,
    utopiair,
    wistful,
}

const audioPaths = {
    abame,
    ankhmorpark,
    asteroidb612,
    cimeria,
    cityofbrass,
    cyberspace,
}

/**
 *
 * @param {*} flight a flight object in the csv looks like this
 * Location Name: 'Abame',
 * Category 1: 'Environment'
 * Narrative 1: 'Colonized',
 * ... until Category 4 and Narrative 4,
 * FIDS Status: 'Canceled', 'On Time', or 'Delayed'
 * Airline: 'PANACHE'
 */
export const normalizeFlight = (flight) => {
    return {
        destination:
            flight['Location Name'] !== 'Yoknapatawpha County'
                ? flight['Location Name']
                : 'Yoknapatawpha Cnty', // special truncation case for Yokna (only for FIDS)
        status: flight['FIDS STATUS'],
        carrier: imagepaths[flight['Airline'].replace(/ .*/, '').toLowerCase()],
        details: [
            { name: flight['Category 1'], value: flight['Narrative 1'] },
            { name: flight['Category 2'], value: flight['Narrative 2'] },
            { name: flight['Category 3'], value: flight['Narrative 3'] },
            { name: flight['Category 4'], value: flight['Narrative 4'] },
        ],
        departureTime: moment(flight.departureTime).valueOf(),
    }
}

export const replaceFlight = (flights, currentFlight, newFlight) =>
    flights.splice(
        findIndex(flights, { destination: currentFlight.destination }),
        1,
        newFlight
    )

export const shouldFlightBeReplaced = (flight, nextFlight, now) => {
    return (
        flight.departureTime !== now &&
        ((flight.departureTime < now &&
            nextFlight.departureTime <= now &&
            nextFlight.departureTime > flight.departureTime) || // show the most recently departed flight
            (flight.departureTime < now && nextFlight.departureTime > now) ||
            (flight.departureTime > now &&
                nextFlight.departureTime > now &&
                nextFlight.departureTime < flight.departureTime))
    )
}

/** take the full list of flights with duplicate destinations and based on the current time and the current list of flights replace them */
export const findNewFlightTimes = (fullFlights, flights, now) => {
    const flightsToReplace = filter(
        flights,
        (flight) => flight.departureTime < now
    )
    console.log(
        `flightsToReplace: ${JSON.stringify(flightsToReplace)} now: ${now}`
    )
    flightsToReplace.forEach((flightToReplace) => {
        const otherFlightTimes = filter(
            fullFlights,
            (nextFlight) =>
                nextFlight.destination === flightToReplace.destination &&
                nextFlight.departureTime !== flightToReplace.departureTime
        )
        console.log(`otherFlightTimes: ${JSON.stringify(otherFlightTimes)}`)
        let hasFlightBeenReplaced = false
        sortBy(otherFlightTimes, 'departureTime').forEach((otherFlight) => {
            // only replace the first found
            if (
                !hasFlightBeenReplaced &&
                shouldFlightBeReplaced(flightToReplace, otherFlight, now)
            ) {
                console.log(
                    `replacing flight with ${JSON.stringify(otherFlight)}`
                )
                replaceFlight(flights, flightToReplace, otherFlight)
                hasFlightBeenReplaced = true
            }
        })
    })
    return flights
}

/**
 * Using the current time, find the next flight
 * @param {*} flights
 * @param {*} now, timestamp of right now
 */
export const filterFlights = (flights, now = moment().valueOf()) => {
    return flights.reduce((acc, flight) => {
        // do we have the flight already in the list
        const foundFlight = find(acc, { destination: flight.destination })
        // if we don't pop it on the list
        if (!foundFlight) {
            acc.push(flight)
        } else if (shouldFlightBeReplaced(foundFlight, flight, now)) {
            // current flight is in the future, but mine is closer
            replaceFlight(acc, foundFlight, flight)
        }
        return acc
    }, [])
}

/** find the right audio file for a destination */
export const findAudio = (destination) => {
    // strip all special characters from the destination
    var audioNames = Object.keys(audioPaths)

    // if I can't find the matching file return a random path
    return (
        audioPaths[destination.replace(/[\W_]+/g, '').toLowerCase()] ||
        audioPaths[audioNames[(audioNames.length * Math.random()) << 0]]
    )
}

export const determineOnTimeStatus = (flight = {}, boardingTime) => {
    const now = moment()
    if (flight.status !== 'On Time') {
        return flight.status
    }
    if (flight.departureTime < now.valueOf()) {
        return 'Departed'
    }
    if (flight.departureTime < now.add(boardingTime, 'minutes').valueOf()) {
        return 'Boarding'
    }
    return 'On Time'
}
