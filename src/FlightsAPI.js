import { normalizeFlight } from "./dataUtils";
import moment from "moment";

export const fetchFlights = minutesToSeparate =>
  fetch("http://localhost:8080/flights", {
    method: "get",
    url: `http://localhost:8080`
  }).then(response => {
    console.log("fetch response");
    return response.json().then(flights =>
      flights.map((flight, index) => ({
        ...normalizeFlight(flight),
        departureTime: minutesToSeparate
          ? moment()
              .add(minutesToSeparate * (index + 1), "minutes")
              .valueOf() // fake the minutes}))
          : moment(flight.departureTime).valueOf()
      }))
    );
  });
