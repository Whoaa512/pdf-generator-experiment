import fs from 'fs'

import pify from 'pify'
import { VM } from 'vm2'
import { transformAsync } from '@babel/core'
import JsxPdf from 'jsx-pdf'
import PDFMake from 'pdfmake'
import getStream from 'get-stream'

import fonts from './fonts'

const readFile = pify(fs.readFile)
const DEBUG = true

const log = {
    debug(...args) {
        if (!DEBUG) {
            return
        }
        /* eslint-disable-next-line no-console */
        console.debug(...args)
    },
    error(...args) {
        /* eslint-disable-next-line no-console */
        console.error(...args)
    },
    info(...args) {
        /* eslint-disable-next-line no-console */
        console.log(...args)
    },
}

async function run(argument) {
    const jsxString = await readFile('./test-jsx.txt')

    log.debug({ jsxString }, 'read file')
    const code = `JsxPdf.renderPdf(${jsxString})`

    const compiled = await transformAsync(code, {
        plugins: [
            [
                '@babel/plugin-transform-react-jsx',
                {
                    pragma: 'JsxPdf.createElement',
                },
            ],
        ],
    })

    log.debug({ compiled }, 'transformed')

    const vm = new VM({ timeout: 10000 })

    vm.freeze(JsxPdf, 'JsxPdf')

    const output = vm.run(`${compiled.code}`.replace('"use strict";', ''))

    log.debug({ output }, 'evaluated result')

    const pdfMake = new PDFMake(fonts)
    const pdfStream = pdfMake.createPdfKitDocument(output)

    pdfStream.end()
    const pdfBuffer = await getStream.buffer(pdfStream)

    log.debug('pdfBuffer', pdfBuffer)
    const dataUrl = `"data:application/pdf;base64,${pdfBuffer.toString(
        'base64',
    )}"`

    log.debug('dataUrl', dataUrl)
}

run()
    .then(() => {
        return process.exit()
    })
    .catch(e => {
        log.error(`e:`, e)
        return process.exit(1)
    })
