import React, { useEffect, useState } from "react";
import "./App.css";
import FlightDeparturesTable from "./FlightDeparturesTable";
import moment from "moment";
import findIndex from "lodash/findIndex";
import omit from "lodash/omit";
import sortBy from "lodash/sortBy";
import { fetchFlights } from "./FlightsAPI";
import logo from "./imgs/InterimaginaryDepartures-logo.png";
import { determineOnTimeStatus } from "./dataUtils";

const DEFAULT_FLIGHT_SEPARATION = 0.25;
const FLIGHTS_PER_PAGE = 27;
const BOARDING_TIME = 5;

function App() {
  const [currentTime, setCurrentTime] = useState(moment().valueOf());
  const [flights, setFlights] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDay, setCurrentDay] = useState(moment().dayOfYear());
  // reload the flights data if we switch days
  useEffect(() => {
    loadAndSetFlights();
  }, [currentDay]);

  const loadAndSetFlights = (separation = DEFAULT_FLIGHT_SEPARATION) => {
    fetchFlights().then(
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
        setFlights(sortBy(flights, "destination"));
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
      setCurrentDay(moment().dayOfYear());
    }, 10000);
    return () => clearInterval(interval);
  }, [setCurrentTime]);

  // update the current page every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(currentIndex =>
        currentIndex + FLIGHTS_PER_PAGE > flights.length
          ? 0
          : currentIndex + FLIGHTS_PER_PAGE
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [setCurrentIndex, flights]);

  return (
    <div className="app">
      <div className="app-title">
        <img alt="Interimaginary Departures" src={logo} />
      </div>
      <FlightDeparturesTable
        startGray={currentIndex % 2}
        flights={flights
          .slice(currentIndex, currentIndex + FLIGHTS_PER_PAGE)
          .map(flight => ({
            ...flight,
            status: determineOnTimeStatus(flight, BOARDING_TIME)
          }))}
      />
    </div>
  );
}

export default App;
