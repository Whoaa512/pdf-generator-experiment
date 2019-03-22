import fs from 'fs'
import path from 'path'

import pify from 'pify'

import { parseJsx } from '../parseJsx'

const readFile = pify(fs.readFile)

async function run(fileName) {
    const jsxString = await readFile(
        path.resolve(__dirname, '../../../test-fixtures/', fileName),
        { encoding: 'utf-8' },
    )

    return parseJsx(jsxString)
}

describe('parseJsx', () => {
    test('happy path', async () => {
        expect.assertions(1)

        const result = await run('test-jsx.txt')

        expect(result).toMatchSnapshot()
    })

    describe('invalid input', () => {
        test('attack-1', async () => {
            expect.assertions(1)

            const result = run('attack-1.txt')

            await expect(result).rejects.toThrowError(
                'Script execution timed out.',
            )
        })

        test('attack-2', async () => {
            expect.assertions(1)

            const result = run('attack-2.txt')

            await expect(result).rejects.toThrowError(
                `unknown: Unexpected token`,
            )
        })

        test('attack-3', async () => {
            expect.assertions(1)

            const result = run('attack-3.txt')

            await expect(result).rejects.toThrowError(
                'The <document> element can only contain <header>, <content>, and <footer> elements but found undefined',
            )
        })

        test('attack-4', async () => {
            expect.assertions(1)

            const result = run('attack-4.txt')

            await expect(result).rejects.toThrowError(
                "Cannot read property 'elementName' of null",
            )
        })

        test('attack-5', async () => {
            expect.assertions(1)

            const result = run('attack-5.txt')

            await expect(result).rejects.toThrowError(
                "Cannot read property 'call' of undefined",
            )
        })

        test('attack-6', async () => {
            expect.assertions(1)

            const result = run('attack-6.txt')

            await expect(result).rejects.toThrowError(
                'unknown: Unexpected token',
            )
        })

        test('attack-7', async () => {
            expect.assertions(1)

            const result = run('attack-7.txt')

            await expect(result).rejects.toThrowError(
                'unknown: Unexpected token',
            )
        })

        test('attack-8', async () => {
            expect.assertions(1)

            const result = run('attack-8.txt')

            await expect(result).rejects.toThrowError(
                'Script execution timed out.',
            )
        })

        test('attack-9', async () => {
            expect.assertions(1)

            const result = run('attack-9.txt')

            await expect(result).rejects.toThrowError('require is not defined')
        })
    })
})
