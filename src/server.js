const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const sortBy = require("lodash").sortBy;
const isNil = require("lodash").isNil;
const csvtojson = require("csvtojson");
const addDepartureTimes = require("./serverDataUtils").addDepartureTimes;

app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

function loadFlights(day) {
  return (
    csvtojson()
      .fromFile(
        path.resolve(
          __dirname,
          "./data/Interimaginary Departures Data Set - Sheet1.csv"
        )
      )
      // Add departure times to each flight
      .then(flights => {
        return sortBy(addDepartureTimes(flights, day), "departureTime");
      })
      .catch(error => console.log(error))
  );
}

app.get("/flights", function(req, res) {
  return loadFlights(req.query && !isNil(req.query.day) ? parseInt(req.query.day) : undefined).then(flights => res.send(flights));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8080;

console.log(`server started on ${port}`);

app.listen(port);
