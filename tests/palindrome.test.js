const { palindrome } = require('../utils/for_testing')

test('palindrome of MrKrrot', () => {
    const result = palindrome('MrKrrot')

    expect(result).toBe('torrKrM')
})

test('palindrome of empty string', () => {
    const result = palindrome('')

    expect(result).toBe('')
})

test('palindrome of undefined', () => {
    const result = palindrome()

    expect(result).toBeUndefined()
})
