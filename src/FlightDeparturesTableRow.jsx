import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styles from './FlightDeparturesTableRow.module.css'
import infinity from './imgs/Infinity.png'
import classnames from 'classnames'

const propTypes = {
    destination: PropTypes.string.isRequired,
    carrier: PropTypes.node.isRequired,
    departureTime: PropTypes.number.isRequired,
    status: PropTypes.oneOf([
        'Departed',
        'Boarding',
        'Canceled',
        'On Time',
        'Delayed',
    ]),
}

const FlightDeparturesTableRow = ({
    className,
    destination,
    carrier,
    departureTime,
    status,
}) => (
    <tr className={classnames(styles.row, className)}>
        <td data-id="destination">
            <span title={destination}>{destination}</span>
        </td>
        <td className={styles.carrier}>
            <img alt="carrier" src={carrier} />
        </td>
        <td className={styles.time}>
            {moment(departureTime).format('h:mm A')}
        </td>
        <td>{status}</td>
        <td data-id="gate">
            <img alt="gate" src={infinity} />
        </td>
    </tr>
)

FlightDeparturesTableRow.propTypes = propTypes

export default FlightDeparturesTableRow
