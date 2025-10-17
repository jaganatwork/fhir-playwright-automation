/* eslint-disable no-console */
export function debugLog(
    label: string,
    data?: Record<string, string | number | boolean | object>
): void {
    if (process.env.DEBUG || process.env.PW_DEBUG) {
        console.log(`\n🧩 [DEBUG] ${label}`);
        if (data) {
            for (const [key, value] of Object.entries(data)) {
                console.log(`   ${key}: ${JSON.stringify(value)}`);
            }
        }
    }
}
