import {
    normalizeFlight,
    filterFlights,
    findNewFlightTimes,
} from '../dataUtils'

describe('dataUtils', () => {
    test('normalizeFlight', () => {
        const normalizedFlight = normalizeFlight({
            'Location Name': 'Abame',
            'Category 1': 'Environment',
            'Narrative 1': 'Colonized',
            'Category 2': 'Atmosphere',
            'Narrative 2': 'Tragic',
            'Category 3': 'Weather',
            'Narrative 3': 'Tropical',
            'Category 4': 'Terrain',
            'Narrative 4': 'Forest and farmland',
            'FIDS STATUS': 'Canceled',
            Airline: 'PANACHE',
        })
        expect(normalizedFlight.details).toEqual([
            { name: 'Environment', value: 'Colonized' },
            { name: 'Atmosphere', value: 'Tragic' },
            { name: 'Weather', value: 'Tropical' },
            { name: 'Terrain', value: 'Forest and farmland' },
        ])
        expect(normalizedFlight.carrier).toBeDefined()
        expect(normalizedFlight.destination).toBeDefined()
        expect(normalizedFlight.status).toBeDefined()
    })
    test('filterFlights', () => {
        const mockFlights = [
            { departureTime: 1, destination: 'Abame' },
            { departureTime: 3, destination: 'Abame' },
        ]
        expect(filterFlights(mockFlights, 0)).toHaveLength(1)
        expect(filterFlights(mockFlights, 0)[0]).toEqual({
            departureTime: 1,
            destination: 'Abame',
        })
        expect(filterFlights(mockFlights, 2)).toHaveLength(1)
        expect(filterFlights(mockFlights, 2)[0]).toEqual({
            departureTime: 3,
            destination: 'Abame',
        })
    })
    test('findNewFlightTimes', () => {
        const mockFlights = [
            { departureTime: 1, destination: 'Abame' },
            { departureTime: 3, destination: 'Abame' },
            { departureTime: 5, destination: 'Abame' },
        ]

        // haven't started yet
        expect(findNewFlightTimes(mockFlights, [mockFlights[0]], 0)).toEqual([
            mockFlights[0],
        ])
        expect(findNewFlightTimes(mockFlights, [mockFlights[0]], 1)).toEqual([
            mockFlights[0],
        ])
        expect(findNewFlightTimes(mockFlights, [mockFlights[0]], 2)).toEqual([
            mockFlights[1],
        ])
        expect(findNewFlightTimes(mockFlights, [mockFlights[1]], 3)).toEqual([
            mockFlights[1],
        ])
        expect(findNewFlightTimes(mockFlights, [mockFlights[1]], 4)).toEqual([
            mockFlights[2],
        ])
        expect(findNewFlightTimes(mockFlights, [mockFlights[2]], 5)).toEqual([
            mockFlights[2],
        ])
        expect(findNewFlightTimes(mockFlights, [mockFlights[2]], 6)).toEqual([
            mockFlights[2],
        ])
    })
})
