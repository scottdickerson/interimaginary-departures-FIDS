import moment from 'moment'
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
        destination: flight['Location Name'],
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

export const shouldFlightBeReplaced = (flight, nextFlight, now) => {
    return (
        flight.departureTime !== now &&
        ((flight.departureTime < now && // both flights have already left, use the later one
            nextFlight.departureTime <= now &&
            nextFlight.departureTime > flight.departureTime) ||
            (flight.departureTime < now && nextFlight.departureTime > now) ||
            (flight.departureTime > now && // flight is in the future, but next flight is closer to the current time, then next flight should be used
                nextFlight.departureTime > now &&
                nextFlight.departureTime < flight.departureTime))
    )
}

/**
 * Using the current time and the full list of flights return a list of flights where the "next" flight to a destination is shown.
 *  If the last flight to a destination has already departed, make sure to still include it in the list so it shows departed.
 * @param {*} flights
 * @param {*} now, timestamp of right now
 */
export const filterFlights = (flights, now = moment().valueOf()) => {
    const flightMap = flights.reduce((acc, flight) => {
        if (!acc[flight.destination]) {
            acc[flight.destination] = flight // only push the destination once
        } else if (
            shouldFlightBeReplaced(acc[flight.destination], flight, now)
        ) {
            acc[flight.destination] = flight
        }
        return acc
    }, {})
    return sortBy(Object.values(flightMap), 'destination')
}

/**
 *
 *
 * @param {*} startIndex index to start the page of flights from
 * @param {*} flightsWithUniqueDestinations.  Array containing all destinations but only flight per destinatio
 * @param {*} flightsPerPage Number of flights shown per page
 * @returns
 */
export const determineCurrentPageDisplayedFlights = (
    startIndex,
    flightsWithUniqueDestinations,
    flightsPerPage
) => {
    return flightsWithUniqueDestinations
        .slice(startIndex, startIndex + flightsPerPage)
        .concat(
            flightsWithUniqueDestinations.slice(
                0,
                Math.max(
                    0,
                    startIndex +
                        flightsPerPage -
                        flightsWithUniqueDestinations.length
                )
            )
        )
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
