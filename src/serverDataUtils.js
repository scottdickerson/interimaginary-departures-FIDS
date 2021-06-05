const moment = require('moment')
const sortBy = require('lodash/sortBy')
const departureOffsets = require('./data/weeklyDepartureOffsets')

function addDepartureTimes(flights, day = moment().day(), flightsInADay = 326) {
    console.log(`day to load: ${day}`)
    flights = sortBy(flights, 'Location Name')
    const today = moment()
    // set the start time for flights to 5:00 am in the morning
    today.hour(5)
    today.minute(0)
    today.second(0)
    today.millisecond(0)
    let offsets = departureOffsets.sunday
    switch (day) {
        case 0:
        default:
            offsets = departureOffsets.sunday
            break
        case 1:
            offsets = departureOffsets.monday
            break
        case 2:
            offsets = departureOffsets.tuesday
            break
        case 3:
            offsets = departureOffsets.wednesday
            break
        case 4:
            offsets = departureOffsets.thursday
            break
        case 5:
            offsets = departureOffsets.friday
            break
        case 6:
            offsets = departureOffsets.saturday
            break
        case 7: // special case for testing where we alphabetize the flights
            console.log(`using special offset:`)
            offsets = flights.map((flight, index) => index * 3.5 * 60 * 1000)
            break
    }

    const flightsToGenerate =
        Math.ceil(flightsInADay / offsets.length) * offsets.length
    console.log(`flightsToGenerate: ${flightsToGenerate}`)

    const flightsWithDepartureTimes = []
    for (
        let flightNumber = 0;
        flightNumber < flightsToGenerate;
        flightNumber++
    ) {
        const offset = offsets[flightNumber % offsets.length]
        if (flightNumber > 0 && flightNumber % offsets.length === 0) {
            // if we run out of offsets reset the base time to the final flight time
            today.add(3.5 * offsets.length, 'minutes')
        }
        flightsWithDepartureTimes.push({
            ...flights[flightNumber % flights.length],
            departureTime: today.clone().add(offset, 'milliseconds'),
        })
    }

    // console.log(JSON.stringify(flightsWithDepartureTimes));
    return sortBy(flightsWithDepartureTimes, 'departureTime').slice(
        0,
        flightsInADay
    )
}

module.exports = {
    addDepartureTimes,
}
