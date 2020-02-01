import React, { useEffect, useState } from "react";
import "./App.css";
import FlightDeparturesTable from "./FlightDeparturesTable";
import moment from "moment";
import findIndex from "lodash/findIndex";
import omit from "lodash/omit";
import { fetchFlights } from "./FlightsAPI";
import logo from "./imgs/InterimaginaryDepartures-logo.png";
import { determineOnTimeStatus } from "./dataUtils";

const DEFAULT_FLIGHT_SEPARATION = 10;

function App() {
  const [currentTime, setCurrentTime] = useState(moment().valueOf());
  const [flights, setFlights] = useState([]);

  const loadAndSetFlights = (separation = DEFAULT_FLIGHT_SEPARATION) => {
    fetchFlights(separation).then(
      (
        flights // start the flights every 10 minutes
      ) => {
        console.log(
          `flights response ${JSON.stringify(
            flights.map(flight => omit(flight, ["carrier"])),
            null,
            2
          )}`
        );
        setFlights(flights);
      }
    );
  };

  const nextFlight = findIndex(flights, flight => {
    console.log(
      `flight departureTime ${flight.departureTime} currentTime ${currentTime}`
    );
    return flight.departureTime > currentTime;
  });

  // load the flights data if we can't find the next flight
  useEffect(() => {
    if (nextFlight < 0) {
      loadAndSetFlights();
    }
  }, [setFlights, nextFlight]);

  // update the current time every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().valueOf());
    }, 5000);
    return () => clearInterval(interval);
  }, [setCurrentTime]);

  return (
    <div className="app">
      <div className="app-title">
        <img alt="Interimaginary Departures" src={logo} />
      </div>
      <FlightDeparturesTable
        flights={flights.map(flight => ({
          ...flight,
          status: determineOnTimeStatus(flight)
        }))}
      />
    </div>
  );
}

export default App;
