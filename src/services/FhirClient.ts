import type { APIRequestContext } from '@playwright/test';
import type { ResourceBase } from '../types/fhir.js';
import { debugLog } from '../utils/logger.js';

export class FhirClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly baseURL: string
    ) {}

    async create<T extends ResourceBase>(
        resourceType: T['resourceType'],
        body: T
    ): Promise<T> {
        const url = `${this.baseURL}/${resourceType}`;

        if (process.env.DEBUG || process.env.PW_DEBUG) {
            debugLog(`\n📡 [FhirClient.create]`);
            debugLog(`   → Base URL: ${this.baseURL}`);
            debugLog(`   → Endpoint: ${url}`);
            debugLog(`   → Payload: ${JSON.stringify(body, null, 2)}`);
        }

        const res = await this.request.post(url, {
            data: body,
            headers: {
                'Content-Type': 'application/fhir+json',
                Accept: 'application/fhir+json',
            },
        });

        const status = res.status();
        if (process.env.DEBUG || process.env.PW_DEBUG) {
            debugLog(`   → HTTP Status: ${status}`);
        }

        if (status !== 201) {
            const txt = await res.text();
            throw new Error(`Create ${resourceType} failed: ${status} ${txt}`);
        }

        return (await res.json()) as T;
    }
}
