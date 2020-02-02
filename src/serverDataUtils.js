const moment = require("moment");
const departureOffsets = require("./data/weeklyDepartureOffsets");

function addDepartureTimes(flights, today = moment()) {
  // set the start time for flights to 5:00 am in the morning
  today.hour(5);
  today.minute(0);
  today.second(0);
  today.millisecond(0);
  let offsets = departureOffsets.sunday;
  switch (today.day()) {
    case 0:
    default:
      offsets = departureOffsets.sunday;
      break;
    case 1:
      offsets = departureOffsets.monday;
      break;
    case 2:
      offsets = departureOffsets.tuesday;
      break;
    case 3:
      offsets = departureOffsets.wednesday;
      break;
    case 4:
      offsets = departureOffsets.thursday;
      break;
    case 5:
      offsets = departureOffsets.friday;
      break;
    case 6:
      offsets = departureOffsets.saturday;
      break;
  }

  console.log(
    `offsetLength: ${offsets.length} and flights length: ${flights.length}`
  );
  const flightsWithDepartureTimes = offsets.map((offset, index) => {
    // Find the matching flight in the full offset array
    const flight = flights[index % flights.length];
    return {
      ...flight,
      departureTime: today.clone().add(offset, "milliseconds")
    };
  });
  // console.log(JSON.stringify(flightsWithDepartureTimes));
  return flightsWithDepartureTimes;
}

module.exports = {
  addDepartureTimes
};
