import React, { useEffect, useState } from 'react'
import './App.css'
import FlightDeparturesTable from './FlightDeparturesTable'
import moment from 'moment'
// import omit from 'lodash/omit'
// import { fetchFlights } from './api/FlightsAPI'
// import logo from './imgs/InterimaginaryDepartures-logo.png'
import isEqual from 'lodash/isEqual'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllFlights } from './api/FlightsActions'
import {
    determineCurrentPageDisplayedFlights,
    determineOnTimeStatus,
    filterFlights,
} from './api/dataUtils'

const FLIGHTS_PER_PAGE = 29
const FLIGHTS_TO_ADVANCE = 7
// Show Now Boarding for any flight within the next 3.5 minutes
const BOARDING_TIME = 3.5
// Number of seconds to delay before flipping the page
const PAGE_DELAY = 15
// const PAGE_DELAY = 1000000

const App = () => {
    /** Has full list of flights not flitered */
    const reduxFlights = useSelector((state) => state?.flights?.data, isEqual)
    const dispatch = useDispatch()

    const [startFlight, setStartFlight] = useState(0)
    const [currentDay] = useState(moment().day())

    /** Load on initial render */
    useEffect(() => {
        // Keep trying to fetch flights until we get them (the nodejs server might not be started yet)
        const interval = setInterval(() => {
            if (!reduxFlights || reduxFlights.length === 0) {
                console.log('retrying flights')
                dispatch(fetchAllFlights(currentDay))
            }
        }, 1000)

        if (reduxFlights && reduxFlights.length > 0) {
            console.log('found flights', reduxFlights)
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    }, [currentDay, dispatch, reduxFlights])

    const flightsWithUniqueDestinations = filterFlights(reduxFlights ?? [])

    // Advance the page of flights
    useEffect(() => {
        const interval = setInterval(() => {
            // If we're on a different day, reload the whole app
            const now = moment()
            if (now.day() !== currentDay) {
                // reload the entire app if we switch days
                window.location.reload()
            } else {
                setStartFlight(
                    (startFlight) =>
                        (startFlight + FLIGHTS_TO_ADVANCE) %
                        flightsWithUniqueDestinations.length
                )
            }
        }, PAGE_DELAY * 1000)
        return () => clearInterval(interval)
    }, [currentDay, dispatch, flightsWithUniqueDestinations])

    console.log('start Flight', startFlight)

    return (
        <div className="app">
            <div className="app-title">
                {/*<img alt="Interimaginary Departures" src={logo} />*/}

                <h2>Interimaginary Departures</h2>
            </div>
            <FlightDeparturesTable
                startGray={startFlight % 2 === 0} // even starts gray
                flights={determineCurrentPageDisplayedFlights(
                    startFlight,
                    flightsWithUniqueDestinations,
                    FLIGHTS_PER_PAGE
                ).map((flight) => ({
                    ...flight,
                    status: determineOnTimeStatus(flight, BOARDING_TIME),
                }))}
            />
        </div>
    )
}

export default App
