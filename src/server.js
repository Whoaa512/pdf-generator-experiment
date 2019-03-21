import http from 'http'

import _ from 'lodash'
import express from 'express'
import bodyParser from 'body-parser'
import { VM } from 'vm2'
import { transformAsync } from '@babel/core'
import JsxPdf from 'jsx-pdf'
import PDFMake from 'pdfmake'
import getStream from 'get-stream'

import fonts from '../fonts'

import { log, setDebug } from './log'

const INTERNAL_SERVER_ERROR = 500
const BAD_REQUEST = 400
const OK = 200
const DEFAULT_PORT = 3000
const DEFAULT_PARSE_TIMEOUT = 5000

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))

async function parseJsx(jsxString) {
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

    log.debug('~~~~~~~~')
    log.debug('transformed:', compiled.code)
    log.debug('~~~~~~~~')

    const vm = new VM({ timeout: DEFAULT_PARSE_TIMEOUT })

    vm.freeze(JsxPdf, 'JsxPdf')

    return vm.run(`${compiled.code}`.replace('"use strict";', ''))
}

function isValidPdfJson(json) {
    // todo: write a JSON schema for validation
    // [pdfmake JSON schema ? · Issue #1408 · bpampuch/pdfmake · GitHub](https://github.com/bpampuch/pdfmake/issues/1408)
    // [PDFMakeDefs.md · GitHub](https://gist.github.com/jfdesrochers/08833957232a04638c1cad4d071b31e9)
    return true
}

class ServerError extends Error {
    constructor(message, statusCode = INTERNAL_SERVER_ERROR) {
        super(message)
        this.statusCode = statusCode
    }
}

app.post('/pdf', async (req, res) => {
    try {
        const { content } = req.body
        let compiledPdfJson

        if (_.isString(content)) {
            compiledPdfJson = await parseJsx(content)
        } else if (_.isPlainObject(content)) {
            compiledPdfJson = content
        }

        const wasCompiled = Boolean(compiledPdfJson)
        const isValid = isValidPdfJson(compiledPdfJson)

        if (!(wasCompiled && isValid)) {
            log.warn(
                {
                    wasCompiled,
                    isValid,
                },
                'Failed validation',
            )

            throw new ServerError('Failed validation', BAD_REQUEST)
        }

        log.debug({ compiledPdfJson }, 'Got pdf json')

        const pdfMake = new PDFMake(fonts)
        const pdfStream = pdfMake.createPdfKitDocument(compiledPdfJson)

        pdfStream.end()
        const pdfBuffer = await getStream.buffer(pdfStream)

        log.debug({ pdfBuffer })

        const dataUrl = `data:application/pdf;base64,${pdfBuffer.toString(
            'base64',
        )}`

        setDebug(true)
        log.debug({ dataUrl })
        setDebug(false)

        res.sendStatus(OK)
    } catch (error) {
        log.error(error)
        const statusCode = error.statusCode || INTERNAL_SERVER_ERROR

        res.sendStatus(statusCode)
    }
})

const server = http.createServer(app)
const port = _.get(process, 'env.PORT') || DEFAULT_PORT

server.listen(port)

log.info('http server listening on port %d', port)
log.info('dev-playground is available at http://localhost:%d', port)
