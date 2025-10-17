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
            headers: this.fhirHeaders(),
        });

        const status = res.status();
        if (process.env.DEBUG || process.env.PW_DEBUG) {
            debugLog(`   → HTTP Status: ${status}`);
        }

        this.ensure201(res, resourceType);

        return (await res.json()) as T;
    }
    async read<T extends ResourceBase>(
        resourceType: T['resourceType'],
        id: string
    ): Promise<T> {
        const res = await this.request.get(
            `${this.baseURL}/${resourceType}/${id}`
        );
        if (res.status() !== 200)
            throw new Error(`GET ${resourceType}/${id} failed`);
        return (await res.json()) as T;
    }
    async patch<T extends ResourceBase>(
        resourceType: T['resourceType'],
        id: string,
        patchBody: any[]
    ): Promise<T> {
        const res = await this.request.patch(
            `${this.baseURL}/${resourceType}/${id}`,
            {
                data: patchBody,
                headers: { 'Content-Type': 'application/json-patch+json' },
            }
        );
        if (res.status() !== 200)
            throw new Error(`PATCH ${resourceType}/${id} failed`);
        return (await res.json()) as T;
    }

    async delete(resourceType: string, id: string): Promise<number> {
        const res = await this.request.delete(
            `${this.baseURL}/${resourceType}/${id}`
        );
        return res.status();
    }
    private fhirHeaders() {
        return {
            'Content-Type': 'application/fhir+json',
            Accept: 'application/fhir+json',
        };
    }
    private async ensure201(res: any, resource: string) {
        if (res.status() !== 201) {
            const txt = await res.text();
            throw new Error(
                `Create ${resource} failed: ${res.status()} ${txt}`
            );
        }
    }
}
