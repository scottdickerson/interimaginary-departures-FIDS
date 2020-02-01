import React from "react";
import PropTypes from "prop-types";

import FlightDeparturesTableHeader from "./FlightDeparturesTableHeader";
import FlightDeparturesTableRow from "./FlightDeparturesTableRow";
import styles from "./FlightDeparturesTable.module.css";

const propTypes = {
  flights: PropTypes.arrayOf(
    PropTypes.shape({
      destination: PropTypes.string,
      status: PropTypes.oneOf(["Boarding", "On Time", "Departed", "Canceled"])
        .isRequired,
      /** usually a picture that describes the flight carrier */
      carrier: PropTypes.node.isRequired,
      /** timestamp of the departure time */
      departureTime: PropTypes.number.isRequired
    })
  )
};

const FlightDeparturesTable = ({ flights }) => (
  <table className={styles.table}>
    <thead>
      <FlightDeparturesTableHeader />
    </thead>
    <tbody>
      {flights.map((flight, index) => (
        <FlightDeparturesTableRow
          key={`row-${flight.destination}`}
          className={index % 2 === 0 && styles.gray}
          {...flight}
        />
      ))}
    </tbody>
  </table>
);

FlightDeparturesTable.propTypes = propTypes;
export default FlightDeparturesTable;
