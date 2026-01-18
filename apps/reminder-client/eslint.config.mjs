import nx from '@nx/eslint-plugin';

import baseConfig from '../../eslint.config.mjs';

export default [
    ...baseConfig,
    ...nx.configs['flat/angular'],
    ...nx.configs['flat/angular-template'],
    {
        files: ['**/*.ts'],
        rules: {
            '@angular-eslint/component-selector': [
                'error',
                {
                    style: 'kebab-case',
                    prefix: 'ra',
                    type: 'element',
                },
            ],
            '@angular-eslint/directive-selector': [
                'error',
                {
                    style: 'camelCase',
                    prefix: 'ra',
                    type: 'attribute',
                },
            ],
        },
    },
    {
        files: ['**/*.html'],
        // Override or add rules here
        rules: {},
    },
];
