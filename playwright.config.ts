import { defineConfig, devices } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';
import dotenv from 'dotenv';

// add near top of file
function logConfigDebug<T extends Record<string, unknown>>(
    label: string,
    data: T
): void {
    if (process.env.DEBUG || process.env.PW_DEBUG) {
        /* eslint-disable no-console */
        console.log(`\n🧩 [DEBUG] ${label}:`);
        for (const [key, value] of Object.entries(data)) {
            /* eslint-disable no-console */
            console.log(`   ${key.padEnd(15)} = ${String(value)}`);
        }
    }
}
/* eslint-enable no-console */

// 1) choose which env file to load
// Priority: explicit ENV_FILE > .env.<NODE_ENV> > .env
const repoRoot = process.cwd();
const explicitEnvFile = process.env.ENV_FILE
    ? path.resolve(repoRoot, process.env.ENV_FILE)
    : undefined;

const nodeEnv = process.env.NODE_ENV || 'local';
const layeredEnvCandidates = [
    explicitEnvFile, // e.g. ENV_FILE=env/.env.qa
    path.resolve(repoRoot, `env/.env.${nodeEnv}`), // e.g. env/.env.local
    path.resolve(repoRoot, `.env.${nodeEnv}`), // e.g. .env.local
    path.resolve(repoRoot, '.env'), // fallback
].filter(Boolean) as string[];

// 2) load the first file that exists
for (const candidate of layeredEnvCandidates) {
    if (fs.existsSync(candidate)) {
        dotenv.config({ path: candidate });
        break;
    }
}

// 3) some sensible defaults from env
const BASE_URL = process.env.BASE_URL || 'https://hapi.fhir.org/baseR4';
const STORAGE_STATE = path.resolve('.auth/user.json');
const hasStorage = fs.existsSync(STORAGE_STATE);

// optional toggles from env
const HEADED = (process.env.HEADED || 'false').toLowerCase() === 'true';
const VIDEO = (process.env.VIDEO || 'retain-on-failure') as
    | 'off'
    | 'on'
    | 'retain-on-failure'
    | 'retry-with-video';
const TRACE = (process.env.TRACE || 'on-first-retry') as
    | 'off'
    | 'on'
    | 'retain-on-failure'
    | 'on-first-retry';

logConfigDebug('Resolved Playwright config', {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL,
    HEADED,
    TRACE,
    VIDEO,
    STORAGE_STATE: hasStorage ? STORAGE_STATE : 'none',
});

export default defineConfig({
    testDir: './tests',
    snapshotDir: './tests/__snapshots__',
    outputDir: 'test-results',
    reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
    fullyParallel: true,
    use: {
        baseURL: BASE_URL,
        headless: !HEADED,
        trace: TRACE,
        video: VIDEO,
        storageState: hasStorage ? STORAGE_STATE : undefined, // ✅ safe hybrid approach
    },

    // Example desktop browsers
    projects: [
        {
            name: 'setup', // runs first to create login state
            testMatch: /.*\.setup\.ts$/,
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup'],
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
            dependencies: ['setup'],
        },
        // Add WebKit if you need it
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        //   dependencies: ['setup'],
        // },
    ],
    // nice for CI
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
});
