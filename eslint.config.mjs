import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    {
        plugins: {
            prettier: eslintPluginPrettier,
        },
    },
    {
        ignores: ['node_modules', 'dist'],
    },
    {
        languageOptions: {
            globals: {
                ...globals.es2022,
                ...globals.browser,
            },
        },
    },
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    {
        rules: { ...eslintConfigPrettier.rules, 'prettier/prettier': 'error' },
    },
];
