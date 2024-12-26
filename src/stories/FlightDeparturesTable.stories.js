import React from 'react'
import FlightDeparturesTable from '../FlightDeparturesTable'
import { flights } from './sampleData'

export default {
    title: 'Flight Departures Table',
}

export const flightDetails = () => <FlightDeparturesTable flights={flights} />
