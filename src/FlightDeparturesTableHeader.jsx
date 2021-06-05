import React from 'react'
import styles from './FlightDeparturesTableHeader.module.css'

const FlightDeparturesTableHeader = () => (
    <tr className={styles.header}>
        <th data-id="destination">Destination</th>
        <th data-id="carrier">Carrier</th>
        <th data-id="time">Time</th>
        <th data-id="status">Status</th>
        <th data-id="gate">Gate</th>
    </tr>
)

export default FlightDeparturesTableHeader
