module.exports = {
    presets: [
        [
            '@babel/env',
            {
                targets: {
                    node: '8',
                },
                useBuiltIns: `usage`,
            },
        ],
    ],
    plugins: [
        [
            '@babel/plugin-transform-react-jsx',
            {
                pragma: 'JsxPdf.createElement',
            },
        ],
    ],
}
