const { average } = require('../utils/for_testing')

describe.skip('average', () => {
    test.skip('of one value is the value itself', () => {
        expect(average([1])).toBe(1)
    })

    test.skip('of many is calculated correctly', () => {
        expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
    })

    test.skip('of empty array is zero', () => {
        expect(average([])).toBe(0)
    })

    test.skip('of undefined is zero', () => {
        expect(average()).toBe(0)
    })
})
