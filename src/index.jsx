import _ from 'lodash'
import React, { useState, useRef, useEffect } from 'react'
import Box from 'ui-box'
import fetch from 'unfetch'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import 'prismjs/themes/prism.css'
import 'prismjs/themes/prism-dark.css'

const DEFAULT_CODE = `
<document defaultStyle={{ font: 'OpenSans', fontSize: 12 }}>
    <content>This will appear in my PDF!</content>
</document>`

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
        <Box
            display="flex"
            width="100%"
            height="100vh"
            justifyContent="space-between"
        >
            <Box height="100%" flexBasis="50%">
                <Editor
                    ref={editorEl}
                    value={state.code}
                    onValueChange={async code => {
                        setState({ ...state, code, loading: true })
                        const pdfSrc = await (await fetch('./api/pdf', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                content: code,
                            }),
                        })).text()

                        setState({ ...state, code, pdfSrc, loading: false })
                    }}
                    highlight={code => highlight(code, languages.jsx)}
                    padding={10}
                    style={{
                        fontSize: 12,
                        // backgroundColor: '#436e6f',
                        fontVariantLigatures: 'common-ligatures',
                        borderRadius: '3px',
                    }}
                />
            </Box>
            <Box height="100%" flexBasis="50%" padding={10}>
                {state.loading ? (
                    'loading...'
                ) : state.pdfSrc ? (
                    <iframe width="95%" height="95%" src={state.pdfSrc} />
                ) : (
                    'No pdf data'
                )}
            </Box>
        </Box>
    )
}

export default Home
