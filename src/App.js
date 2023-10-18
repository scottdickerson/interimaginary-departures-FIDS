import React, { useEffect, useState, useMemo } from 'react'
import './App.css'
import FlightDeparturesTable from './FlightDeparturesTable'
import moment from 'moment'
// import omit from 'lodash/omit'
import sortBy from 'lodash/sortBy'
// import { fetchFlights } from './api/FlightsAPI'
// import logo from './imgs/InterimaginaryDepartures-logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllFlights } from './api/FlightsActions'
import { determineOnTimeStatus } from './api/dataUtils'

const FLIGHTS_PER_PAGE = 29
const FLIGHTS_TO_ADVANCE = 6
// Show Now Boarding for any flight within the next 3.5 minutes
const BOARDING_TIME = 3.5
// Number of seconds to delay before flipping the page
const PAGE_DELAY = 15
// const PAGE_DELAY = 1000000

const App = () => {
    const dispatch = useDispatch()

    const [currentTime, setCurrentTime] = useState(moment().valueOf()) // eslint-disable-line
    const [currentDay, setCurrentDay] = useState(moment().day())
    const [currentIndex, setCurrentIndex] = useState(0)
    const [firstRowIsGray, setFirstRowIsGray] = useState(true)

    // this is the flights from the API layer, in an object with the keys being the destination and the values being departure times in order
    const reduxFlights = useSelector((state) => state?.flights?.data)

    // reload the flights data if we switch days because the API changes
    useEffect(() => {
        dispatch(fetchAllFlights(currentDay))
        setCurrentIndex(0)
    }, [currentDay, dispatch])

    const futureFlights = useMemo(() => {
        console.log('recalculating future flights from ', reduxFlights)
        const uniqueFlights = reduxFlights
            ? sortBy(
                  reduxFlights.map((flight) => {
                      // Find next available departure time
                      if (
                          flight.departureTimes.find(
                              (departureTimes) => departureTimes > currentTime
                          )
                      ) {
                          return {
                              ...flight,
                              departureTime: flight.departureTimes.find(
                                  (departureTimes) =>
                                      departureTimes > currentTime
                              ),
                          }
                      } else {
                          // return the last passed departure time so it can show "Departed"
                          return {
                              ...flight,
                              departureTime:
                                  flight.departureTimes[
                                      flight.departureTimes.length - 1
                                  ],
                          }
                      }
                  }),

                  'destination'
              )
            : []
        console.log('recalculated future flights', uniqueFlights)
        return uniqueFlights
    }, [reduxFlights, currentTime])

    // update the current time every 30 seconds, TODO: why can't I do this with isMemo on on the delay useEffect render
    useEffect(() => {
        const interval = setInterval(() => {
            const now = moment()
            setCurrentTime(now.valueOf())
            setCurrentDay(now.day())
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((currentIndex) => {
                const newIndex =
                    (currentIndex + FLIGHTS_TO_ADVANCE) % futureFlights.length
                console.log('new current index', currentIndex)
                return newIndex
            })
            // Flip the first row to gray now
            setFirstRowIsGray((firstRowIsGray) => !firstRowIsGray)
        }, PAGE_DELAY * 1000)
        return () => clearInterval(interval)
    }, [futureFlights.length])

    const visibleFlights = useMemo(() => {
        const wrapAroundFlightsIndex =
            currentIndex + FLIGHTS_PER_PAGE >= futureFlights.length
                ? currentIndex + FLIGHTS_PER_PAGE - futureFlights.length
                : 0
        console.log('wraparoundindex', wrapAroundFlightsIndex)
        return [
            ...futureFlights
                .slice(currentIndex, currentIndex + FLIGHTS_PER_PAGE)
                .map((flight) => ({
                    ...flight,
                    status: determineOnTimeStatus(flight, BOARDING_TIME),
                })),
            ...futureFlights.slice(0, wrapAroundFlightsIndex),
        ]
    }, [currentIndex, futureFlights])

    return (
        <div className="app">
            <div className="app-title">
                {/*<img alt="Interimaginary Departures" src={logo} />*/}

                <h2>Interimaginary Departures</h2>
            </div>
            <FlightDeparturesTable
                startGray={firstRowIsGray}
                flights={visibleFlights}
            />
        </div>
    )
}

export default App
