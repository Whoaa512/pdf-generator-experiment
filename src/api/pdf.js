import _ from 'lodash'
import PDFMake from 'pdfmake'
import getStream from 'get-stream'

import fonts from '../fonts'
import { ServerError, STATUS_CODES } from '../utils/errors'
import { log, setDebug } from '../utils/log'
import { parseJsx } from '../utils/parseJsx'

function isValidPdfJson(json) {
    // todo: write a JSON schema for validation
    // [pdfmake JSON schema ? · Issue #1408 · bpampuch/pdfmake · GitHub](https://github.com/bpampuch/pdfmake/issues/1408)
    // [PDFMakeDefs.md · GitHub](https://gist.github.com/jfdesrochers/08833957232a04638c1cad4d071b31e9)
    return true
}

module.exports = async (req, res) => {
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

            throw new ServerError('Failed validation', STATUS_CODES.BAD_REQUEST)
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

        // setDebug(true)
        log.debug({ dataUrl })
        setDebug(false)

        res.type('text')

        res.send(dataUrl)
    } catch (error) {
        log.error(error)
        const statusCode =
            error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR

        const json = Buffer.from(
            JSON.stringify(
                {
                    error: error.message || error,
                    statusCode,
                },
                null,
                2,
            ),
        ).toString('base64')
        const payload = `data:plain/text;base64,${json}`

        res.type('text').send(payload)
    }
}
