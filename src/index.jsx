import _ from 'lodash'
import React, { useState, useRef, useEffect } from 'react'
import Box from 'ui-box'
import fetch from 'unfetch'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'normalize.css'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import 'prismjs/themes/prism.css'
import 'prism-themes/themes/prism-a11y-dark.css'
import './styles/base.css'

import { log } from './utils/log'

const DEFAULT_CODE = `
<document defaultStyle={{ font: 'OpenSans', fontSize: 12 }}>
    <content>This will appear in my PDF!</content>
</document>`.trim()
const DEBOUNCE_MS = 1000
const onChange = _.debounce(async (code, state, setState) => {
    try {
        const pdfSrc = await getPdfSrc(code)

        setState({ ...state, code, pdfSrc, loading: false })
    } catch (error) {
        log.error(error)
        setState({ ...state, code, pdfSrc: null, loading: false, error })
    }
}, DEBOUNCE_MS)

const Home = () => {
    const editorEl = useRef(null)
    const [state, setState] = useState({
        code: DEFAULT_CODE,
        pdfSrc: null,
        loadingPdf: true,
    })

    useEffect(() => {
        if (state.pdfSrc == null && editorEl && editorEl.current) {
            _.invoke(editorEl, 'current.props.onValueChange', state.code)
        }
    }, [editorEl])

    return (
        <Box display="flex" width="100%" height="100vh" flexDirection="column">
            <Box
                backgroundColor="#27354a"
                color="#FFF"
                paddingX={10}
                paddingY={5}
            >
                See{' '}
                <a
                    style={{ color: '#16bc9c' }}
                    href="https://github.com/schibsted/jsx-pdf#readme"
                >
                    <code>jsx-pdf</code>
                </a>{' '}
                for more information on how to write a PDF using this syntax
            </Box>
            <Box display="flex" width="100%" height="100%">
                <Box
                    flex={1}
                    display="flex"
                    height="100%"
                    className="editorWrapper"
                >
                    <Editor
                        ref={editorEl}
                        value={state.code}
                        onValueChange={code => {
                            setState({ ...state, code, loading: true })
                            onChange(code, state, setState)
                        }}
                        highlight={code => highlight(code, languages.jsx)}
                        padding={10}
                        style={{
                            fontSize: 16,
                            width: '100%',
                            color: '#b0bec5',
                            backgroundColor: '#2b2b2b',
                            fontVariantLigatures: 'common-ligatures',
                            borderRadius: '3px',
                        }}
                    />
                </Box>
                <Box flex={1} display="flex" height="100%">
                    {state.loading ? (
                        'loading...'
                    ) : state.pdfSrc ? (
                        <iframe width="100%" height="100%" src={state.pdfSrc} />
                    ) : (
                        'No pdf data'
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default Home

async function getPdfSrc(code) {
    return (await fetch('./api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: code,
        }),
    })).text()
}
