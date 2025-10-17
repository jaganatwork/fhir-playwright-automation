export function debugLog(message: string): void {
    if (process.env.DEBUG || process.env.PW_DEBUG) {
        // eslint-disable-next-line no-console
        console.log(message);
    }
}
