module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: 1
    },
    extends: [
        'standard'
    ],
    parserOptions: {
        ecmaVersion: 12
    },
    rules: {
        quotes: [2, 'single', { avoidEscape: true }],
        indent: ['error', 4]
    }
}
