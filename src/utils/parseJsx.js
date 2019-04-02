import _ from 'lodash'
import { VM } from 'vm2'
import { transformAsync } from '@babel/core'
import JsxPdf from 'jsx-pdf'
import moment from 'moment-timezone'

import { log } from './log'

const DEFAULT_PARSE_TIMEOUT = 5000

export async function parseJsx(jsxString, timeout = DEFAULT_PARSE_TIMEOUT) {
    const code = `
        ;${jsxString};
        JsxPdf.renderPdf(doc)`

    if (!_.includes(jsxString, 'doc =')) {
        throw new Error('Missing required `doc` variable in template.')
    }

    const compiled = await transformAsync(code, {
        babelrc: false,
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

    const vm = new VM({ timeout: timeout || DEFAULT_PARSE_TIMEOUT })

    vm.freeze(JsxPdf, 'JsxPdf')
    vm.freeze(moment, 'moment')

    return vm.run(`${compiled.code}`.replace('"use strict";', ''))
}
