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
            'perfectionist/sort-objects': [
                'error',
                {
                    type: 'natural',
                    order: 'asc',
                    groups: ['angular-selector', 'angular-imports', 'angular-view', 'angular-metadata', 'unknown'],
                    customGroups: [
                        {
                            groupName: 'angular-selector',
                            elementNamePattern: '^selector$',
                        },
                        {
                            groupName: 'angular-imports',
                            elementNamePattern: '^(standalone|imports)$',
                        },
                        {
                            groupName: 'angular-view',
                            elementNamePattern: '^(template|templateUrl|style|styles|styleUrl|styleUrls)$',
                        },
                        {
                            groupName: 'angular-metadata',
                            elementNamePattern: '^(host|hostDirectives|animations|changeDetection|providers|exportAs)$',
                        },
                    ],
                },
            ],
            'perfectionist/sort-classes': 'off',
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
                    enforceBuildableLibDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*'],
                        },
                    ],
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
