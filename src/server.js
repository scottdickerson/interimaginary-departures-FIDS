const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const csvtojson = require("csvtojson");
const lodash = require("lodash");

app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

function loadFlights() {
  return csvtojson()
    .fromFile(
      path.resolve(
        __dirname,
        "./data/Interimaginary Departures Data Set - Sheet1.csv"
      )
    )
    .then(flights => {
      return lodash.sortBy(flights, "name");
    })
    .catch(error => console.log(error));
}

app.get("/flights", function(req, res) {
  return loadFlights().then(flights => res.send(flights));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8080;

console.log(`server started on ${port}`);

app.listen(port);
