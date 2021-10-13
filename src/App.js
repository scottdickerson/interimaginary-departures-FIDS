import React, { useEffect, useState } from 'react'
import './App.css'
import FlightDeparturesTable from './FlightDeparturesTable'
import moment from 'moment'
// import omit from 'lodash/omit'
import sortBy from 'lodash/sortBy'
// import { fetchFlights } from './api/FlightsAPI'
// import logo from './imgs/InterimaginaryDepartures-logo.png'
import isEqual from 'lodash/isEqual'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllFlights } from './api/FlightsActions'
import {
    determineOnTimeStatus,
    filterFlights,
    findNewFlightTimes,
} from './api/dataUtils'

const FLIGHTS_PER_PAGE = 29
const FLIGHTS_TO_ADVANCE = 6
// Show Now Boarding for any flight within the next 3.5 minutes
const BOARDING_TIME = 3.5
// Number of seconds to delay before flipping the page
const PAGE_DELAY = 15
// const PAGE_DELAY = 1000000

const App = () => {
    const reduxFlights = useSelector(
        (state) => sortBy(state?.flights?.data, 'destination'), // could actually store this way in the reducer so I don't need to memoize
        isEqual
    )
    const dispatch = useDispatch()

    const [currentTime, setCurrentTime] = useState(moment().valueOf()) // eslint-disable-line
    const [flights, setFlights] = useState([])
    const [currentDay, setCurrentDay] = useState(moment().day())
    const [firstRowIsGray, setFirstRowIsGray] = useState(true)
    // reload the flights data if we switch days
    useEffect(() => {
        dispatch(fetchAllFlights(currentDay))
    }, [currentDay, dispatch])

    useEffect(() => {
        // apply a time filter to flights
        setFlights(filterFlights(sortBy(reduxFlights, 'destination')))
    }, [reduxFlights])

    // update the current time every 5 seconds, TODO: why can't I do this with isMemo on on the delay useEffect render
    useEffect(() => {
        const interval = setInterval(() => {
            const now = moment()
            setCurrentTime(now.valueOf())
            setCurrentDay(now.day())
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    // replace the old flight after it has boarded
    useEffect(() => {
        const interval = setInterval(() => {
            setFlights((flights) =>
                findNewFlightTimes(reduxFlights, flights, moment().valueOf())
            )
        }, (BOARDING_TIME / 2) * 60 * 1000)
        return () => clearInterval(interval)
    }, [reduxFlights])

    // shift the flights over by the FLIGHTS_TO_ADVANCE
    // I couldn't just slice on the starting point of the array because it doesn't wrap around infinitely
    useEffect(() => {
        const interval = setInterval(() => {
            for (
                let flightsToAdvance = 0;
                flightsToAdvance < FLIGHTS_TO_ADVANCE;
                flightsToAdvance++
            ) {
                flights.push(flights.shift()) // take the top element and stick onto the end of the array for 12 flights TODO: probably shouldn't mutate the existing state
            }
            setFlights(flights)
            setFirstRowIsGray((firstRowIsGray) => !firstRowIsGray)
        }, PAGE_DELAY * 1000)
        return () => clearInterval(interval)
    }, [flights])

    return (
        <div className="app">
            <div className="app-title">
                {/*<img alt="Interimaginary Departures" src={logo} />*/}

                <h2>Interimaginary Departures</h2>
            </div>
            <FlightDeparturesTable
                startGray={firstRowIsGray}
                flights={flights.slice(0, FLIGHTS_PER_PAGE).map((flight) => ({
                    ...flight,
                    status: determineOnTimeStatus(flight, BOARDING_TIME),
                }))}
            />
        </div>
    )
}

export default App
