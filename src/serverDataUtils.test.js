const serverDataUtils = require('./serverDataUtils')
const nowString = '2020-02-04T20:20:20'
const MockDate =
    (lastDate) =>
    (...args) =>
        new lastDate(...(args.length ? args : [nowString]))
global.Date = jest.fn(MockDate(global.Date))

describe('serverDataUtils', () => {
    test('addDepartureTimes', () => {
        expect(
            serverDataUtils.addDepartureTimes([
                {
                    status: 'Canceled',
                    departureTime: 1575829800000,
                    destination: 'Arrakis',
                },
            ])
        ).toBeDefined()
    })
})
