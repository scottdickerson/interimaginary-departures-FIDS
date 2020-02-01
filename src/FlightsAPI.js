import { normalizeFlight } from "./dataUtils";
import moment from "moment";

export const fetchFlights = (minutesToSeparate = 3) =>
  fetch("http://localhost:8080/flights", {
    method: "get",
    url: `http://localhost:8080`
  }).then(response => {
    console.log("fetch response");
    return response.json().then(flights =>
      flights.map((flight, index) => ({
        ...normalizeFlight(flight),
        departureTime: moment()
          .add(minutesToSeparate * (index + 1), "minutes")
          .valueOf() // fake the minutes}))
      }))
    );
  });
