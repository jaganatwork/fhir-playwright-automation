// eslint.config.mts
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import playwright from 'eslint-plugin-playwright';
import js from '@eslint/js';

const prettierConfig = {
    semi: true,
    tabWidth: 4,
    useTabs: false,
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    arrowParens: 'always',
    proseWrap: 'preserve',
};

// ✅ Unified ESLint Flat Config for TypeScript + Playwright + Prettier
export default tseslint.config(
    js.configs.recommended, // base JS rules
    ...tseslint.configs.recommended, // base TS rules
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['node_modules', 'dist', 'playwright-report', 'test-results'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.json'],
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            prettier: prettierPlugin,
            playwright,
        },
        rules: {
            'prettier/prettier': ['error', prettierConfig],
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            'no-console': process.env.CI ? 'error' : 'warn',
            'prefer-const': 'error',
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/no-floating-promises': 'error',

            // Playwright
            ...playwright.configs['flat/recommended'].rules,
            'playwright/missing-playwright-await': 'error',
            'playwright/no-page-pause': 'error',
            'playwright/no-useless-await': 'error',
            'playwright/no-skipped-test': 'error',
        },
    }
);
