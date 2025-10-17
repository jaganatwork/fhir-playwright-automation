export const getBaseURL = (): string => {
    const baseURL = process.env.BASE_URL ?? 'https://hapi.fhir.org/baseR4';

    // 🔍 optional debug output
    if (process.env.DEBUG || process.env.PW_DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`\n🧩 [env] Using BASE_URL: ${baseURL}`);
    }
    return baseURL;
};
