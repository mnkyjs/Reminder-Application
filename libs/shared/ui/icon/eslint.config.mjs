import nx from "@nx/eslint-plugin";

import baseConfig from "../../../../eslint.config.mjs";

export default [
    ...baseConfig,
    ...nx.configs["flat/angular"],
    ...nx.configs["flat/angular-template"],
    {
        files: [
            "**/*.ts"
        ],
        rules: {
            "@angular-eslint/component-class-suffix": "off",
            "@angular-eslint/component-selector": [
                "error",
                {
                    style: "kebab-case",
                    prefix: "hlm",
                    type: "element"
                }
            ],
            "@angular-eslint/directive-class-suffix": "off",
            "@angular-eslint/directive-selector": [
                "error",
                {
                    style: "camelCase",
                    prefix: "hlm",
                    type: "attribute"
                }
            ],
            "@angular-eslint/no-input-rename": "off",
            "@nx/enforce-module-boundaries": 
                		(() => {
                  const r = baseConfig.find(c => c.rules && c.rules["@nx/enforce-module-boundaries"])?.rules["@nx/enforce-module-boundaries"];
                  return r ? [r[0], { ...r[1], allowCircularSelfDependency: true }] : undefined;
                })(),
            "@typescript-eslint/naming-convention": [
                			"error",
                			{
                				"selector": "classProperty",
                				"format": ["camelCase"],
                				"leadingUnderscore": "require",
                				"modifiers": ["protected"]
                			}
                		]
        }
    },
    {
        files: [
            "**/*.html"
        ],
        // Override or add rules here
        rules: {
            "@angular-eslint/template/click-events-have-key-events": "off",
            "@angular-eslint/template/interactive-supports-focus": "off"
        }
    }
];
