import { run } from './run'

jest.mock('get-stream', () => ({
    buffer: jest.fn(async () => {
        return 'hello I am pdf'
    }),
}))

test('happy path', async () => {
    expect.assertions(1)

    const result = await run('./fixtures/test-jsx.txt')

    expect(result).toMatchSnapshot()
})

describe('invalid input', () => {
    test('attack-1', async () => {
        expect.assertions(1)

        const result = run('./fixtures/attack-1.txt')

        await expect(result).rejects.toThrowError('Script execution timed out.')
    })

    test('attack-2', async () => {
        expect.assertions(1)

        const result = run('./fixtures/attack-2.txt')

        await expect(result).rejects.toThrowError(
            "Cannot read property 'children' of undefined",
        )
    })

    test('attack-3', async () => {
        expect.assertions(1)

        const result = run('./fixtures/attack-3.txt')

        await expect(result).rejects.toThrowError(
            'The <document> element can only contain <header>, <content>, and <footer> elements but found undefined',
        )
    })

    test('attack-4', async () => {
        expect.assertions(1)

        const result = run('./fixtures/attack-4.txt')

        await expect(result).rejects.toThrowError(
            "Cannot read property 'elementName' of null",
        )
    })

    test('attack-5', async () => {
        expect.assertions(1)

        const result = run('./fixtures/attack-5.txt')

        await expect(result).rejects.toThrowError('require is not defined')
    })

    test('attack-6', async () => {
        expect.assertions(1)

        const result = run('./fixtures/attack-6.txt')

        await expect(result).rejects.toThrowError('unknown: Unexpected token')
    })

    test('attack-7', async () => {
        expect.assertions(1)

        const result = run('./fixtures/attack-7.txt')

        await expect(result).rejects.toThrowError('unknown: Unexpected token')
    })
})
