import React, { useState } from 'react'
import Box from 'ui-box'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import 'prismjs/themes/prism.css'
import 'prismjs/themes/prism-dark.css'

function Home() {
    const [state, setState] = useState({ code: 'hello(foo)' })

    return (
        <Box
            display="flex"
            width="100%"
            height="100vh"
            justifyContent="space-between"
        >
            <Box height="100%" flexBasis="50%">
                <Editor
                    value={state.code}
                    onValueChange={code => setState({ code })}
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
                {state.code}
            </Box>
        </Box>
    )
}

export default Home
