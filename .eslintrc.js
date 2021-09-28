module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'windows'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'no-unused-vars': ['warn', { vars: 'all' }],
    },
}
