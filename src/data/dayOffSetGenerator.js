const shuffle = require("lodash/shuffle");
const fs = require("fs");
const generateRandomDepartureOffsets = () => {
  let offSetTimes = [];
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
    for (let i = 0; i < 200; i++) {
      // generate a flight time every 5 minutes starting at 6 in the morning
      offSetTimes.push(startMinute + i * 5 * 60 * 1000);
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
