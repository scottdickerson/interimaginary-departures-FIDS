const shuffle = require("lodash/shuffle");
const fs = require("fs");
const generateRandomDepartureOffsets = (
  minuteOffset = 3.5,
  departuresInADay = 326
) => {
  const startMinute = 0;
  const offSetMap = {};
  const offSetDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  for (const day of offSetDays) {
    let offSetTimes = [];
    for (let i = 0; i < departuresInADay; i++) {
      // generate a flight time every 5 minutes starting at 6 in the morning
      offSetTimes.push(startMinute + i * minuteOffset * 60 * 1000);
    }
    offSetTimes = shuffle(offSetTimes);

    offSetMap[day] = offSetTimes;
  }
  fs.writeFileSync(
    "./src/data/weeklyDepartureOffsets.js",
    `module.exports=${JSON.stringify(offSetMap)};`
  );
};

generateRandomDepartureOffsets();
