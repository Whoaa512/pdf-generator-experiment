module.exports = {
    presets: [
        [
            'env',
            {
                targets: {
                    node: '8',
                },
            },
        ],
    ],
    plugins: ['babel-plugin-lodash'],
}
