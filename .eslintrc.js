module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    ignorePatterns: ['/test/**', 'gulpfile.js'],
    extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        parser: 'babel-eslint',
    },
    plugins: ['vue'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
}
