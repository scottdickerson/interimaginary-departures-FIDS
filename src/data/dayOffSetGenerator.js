const shuffle = require('lodash/shuffle')
const fs = require('fs')
const generateRandomDepartureOffsets = (minuteOffset = 3.5, flights = 122) => {
    const startMinute = 0
    const offSetMap = {}
    const offSetDays = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ]
    for (const day of offSetDays) {
        let offSetTimes = []
        for (let i = 0; i < flights; i++) {
            offSetTimes.push(startMinute + i * minuteOffset * 60 * 1000)
        }
        offSetTimes = shuffle(offSetTimes)

        offSetMap[day] = offSetTimes
    }
    fs.writeFileSync(
        './src/data/weeklyDepartureOffsets.js',
        `module.exports=${JSON.stringify(offSetMap)};`
    )
}

generateRandomDepartureOffsets()
