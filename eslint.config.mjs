import nx from '@nx/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
        ...perfectionist.configs['recommended-natural'],
        rules: {
            ...perfectionist.configs['recommended-natural'].rules,
            'perfectionist/sort-classes': 'off',
            'perfectionist/sort-objects': [
                'error',
                {
                    customGroups: [
                        {
                            elementNamePattern: '^selector$',
                            groupName: 'angular-selector',
                        },
                        {
                            elementNamePattern: '^(standalone|imports)$',
                            groupName: 'angular-imports',
                        },
                        {
                            elementNamePattern: '^(template|templateUrl|style|styles|styleUrl|styleUrls)$',
                            groupName: 'angular-view',
                        },
                        {
                            elementNamePattern: '^(host|hostDirectives|animations|changeDetection|providers|exportAs)$',
                            groupName: 'angular-metadata',
                        },
                    ],
                    groups: ['angular-selector', 'angular-imports', 'angular-view', 'angular-metadata', 'unknown'],
                    order: 'asc',
                    type: 'natural',
                },
            ],
        },
    },
    {
        ignores: ['**/dist', '**/out-tsc'],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
                    depConstraints: [
                        {
                            onlyDependOnLibsWithTags: ['*'],
                            sourceTag: '*',
                        },
                    ],
                    enforceBuildableLibDependency: true,
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
        rules: {
            'no-console': [
                'error',
                {
                    allow: [
                        'warn',
                        'dir',
                        'timeLog',
                        'assert',
                        'clear',
                        'count',
                        'countReset',
                        'group',
                        'groupEnd',
                        'table',
                        'dirxml',
                        'error',
                        'groupCollapsed',
                        'Console',
                        'profile',
                        'profileEnd',
                        'timeStamp',
                        'context',
                    ],
                },
            ],
        },
    },
];
