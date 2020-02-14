import React, { useEffect, useState } from "react";
import "./App.css";
import FlightDeparturesTable from "./FlightDeparturesTable";
import moment from "moment";
import omit from "lodash/omit";
import sortBy from "lodash/sortBy";
import { fetchFlights } from "./FlightsAPI";
import logo from "./imgs/InterimaginaryDepartures-logo.png";
import { determineOnTimeStatus, filterFlights } from "./dataUtils";

const DEFAULT_FLIGHT_SEPARATION = 0.25;
const FLIGHTS_PER_PAGE = 27;
const FLIGHTS_TO_ADVANCE = 12;
// Show Now Boarding for any flight within the next 3.5 minutes
const BOARDING_TIME = 3.5;
const PAGE_DELAY = 10;

function App() {
  const [currentTime, setCurrentTime] = useState(moment().valueOf()); // eslint-disable-line
  const [flights, setFlights] = useState([]);
  const [currentDay, setCurrentDay] = useState(moment().dayOfYear());
  const [firstRowIsGray, setFirstRowIsGray] = useState(true);
  // reload the flights data if we switch days
  useEffect(() => {
    loadAndSetFlights();
  }, [currentDay]);

  const loadAndSetFlights = (separation = DEFAULT_FLIGHT_SEPARATION) => {
    fetchFlights().then(flights => {
      console.log(
        `flights response ${JSON.stringify(
          flights.map(flight => omit(flight, ["carrier"])),
          null,
          2
        )}`
      );
      setFlights(filterFlights(sortBy(flights,"destination")));
    });
  };

  // update the current time every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().valueOf());
      setCurrentDay(moment().dayOfYear());
      setFlights(filterFlights(flights))
    }, 10000);
    return () => clearInterval(interval);
  }, [flights, setCurrentTime]);

  // shift the flights over by the FLIGHTS_TO_ADVANCE
  useEffect(() => {
    const interval = setInterval(() => {
      for (
        let flightsToAdvance = 0;
        flightsToAdvance < FLIGHTS_TO_ADVANCE;
        flightsToAdvance++
      ) {
        flights.push(flights.shift()); // take the top element and stick onto the end of the array for 12 flights
      }
      setFirstRowIsGray(firstRowIsGray => !firstRowIsGray);
    }, PAGE_DELAY * 1000);
    return () => clearInterval(interval);
  }, [flights]);

  return (
    <div className="app">
      <div className="app-title">
        <img alt="Interimaginary Departures" src={logo} />
      </div>
      <FlightDeparturesTable
        startGray={firstRowIsGray}
        flights={flights.slice(0, FLIGHTS_PER_PAGE).map(flight => ({
          ...flight,
          status: determineOnTimeStatus(flight, BOARDING_TIME)
        }))}
      />
    </div>
  );
}

export default App;
