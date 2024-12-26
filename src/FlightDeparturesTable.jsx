import React from 'react'
import PropTypes from 'prop-types'

import FlightDeparturesTableHeader from './FlightDeparturesTableHeader'
import FlightDeparturesTableRow from './FlightDeparturesTableRow'
import styles from './FlightDeparturesTable.module.css'
import { useSelector } from 'react-redux'

const propTypes = {
    flights: PropTypes.arrayOf(
        PropTypes.shape({
            destination: PropTypes.string,
            status: PropTypes.oneOf([
                'Boarding',
                'On Time',
                'Departed',
                'Canceled',
                'Delayed',
            ]).isRequired,
            /** usually a picture that describes the flight carrier */
            carrier: PropTypes.node.isRequired,
            /** timestamp of the departure time */
            departureTime: PropTypes.number.isRequired,
        })
    ),
    startGray: PropTypes.bool,
}

const FetchingFlights = () => (
    <div className={styles.fetching}>Fetching Flights...</div>
)
const FetchingFlightError = () => (
    <div className={styles.error}>Error Fetching Flights</div>
)

const FlightDeparturesTable = ({ flights, startGray }) => {
    const isFetching = useSelector((state) => state.flights.isFetching)
    const fetchingError = useSelector((state) => state.flights.error)

    return !isFetching && !fetchingError ? (
        <table className={styles.table}>
            <thead>
                <FlightDeparturesTableHeader />
            </thead>
            <tbody>
                {flights.map((flight, index) => (
                    <FlightDeparturesTableRow
                        key={`row-${flight.destination}-${index}`}
                        className={
                            index % 2 === (startGray ? 0 : 1) && styles.gray
                        }
                        {...flight}
                    />
                ))}
            </tbody>
        </table>
    ) : isFetching ? (
        <FetchingFlights />
    ) : fetchingError ? (
        <FetchingFlightError />
    ) : null
}

FlightDeparturesTable.propTypes = propTypes
export default FlightDeparturesTable
