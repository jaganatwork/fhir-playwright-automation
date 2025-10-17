import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ResourceBase } from '../types/fhir.js';
import { debugLog } from '../utils/logger.js';

/**
 * Generic FHIR API client built on Playwright's APIRequestContext.
 * Supports CRUD operations for FHIR resources.
 */
export class FhirClient {
    constructor(
        private readonly request: APIRequestContext,
        private readonly baseURL: string
    ) {}

    /** Create a new FHIR resource (expects 201 Created) */
    async create<T extends ResourceBase>(
        resourceType: T['resourceType'],
        body: T
    ): Promise<T> {
        const url = `${this.baseURL}/${resourceType}`;

        if (process.env.DEBUG || process.env.PW_DEBUG) {
            debugLog('📡 [FhirClient.create]', {
                baseURL: this.baseURL,
                endpoint: url,
                payload: body,
            });
        }

        const res = await this.request.post(url, {
            data: body,
            headers: this.fhirHeaders(),
        });

        const status = res.status();
        if (process.env.DEBUG || process.env.PW_DEBUG) {
            debugLog('HTTP Status', { status });
        }

        await this.ensure201(res, resourceType);

        return (await res.json()) as T;
    }

    /** Read a FHIR resource by ID */
    async read<T extends ResourceBase>(
        resourceType: T['resourceType'],
        id: string
    ): Promise<T> {
        const res = await this.request.get(
            `${this.baseURL}/${resourceType}/${id}`
        );
        if (res.status() !== 200) {
            throw new Error(`GET ${resourceType}/${id} failed`);
        }
        return (await res.json()) as T;
    }

    /** Apply JSON Patch updates to a FHIR resource */
    async patch<T extends ResourceBase>(
        resourceType: T['resourceType'],
        id: string,
        patchBody: Array<Record<string, unknown>>
    ): Promise<T> {
        const res = await this.request.patch(
            `${this.baseURL}/${resourceType}/${id}`,
            {
                data: patchBody,
                headers: { 'Content-Type': 'application/json-patch+json' },
            }
        );

        if (res.status() !== 200) {
            throw new Error(`PATCH ${resourceType}/${id} failed`);
        }

        return (await res.json()) as T;
    }

    /** Delete a FHIR resource by ID (returns status code) */
    async delete(resourceType: string, id: string): Promise<number> {
        const res = await this.request.delete(
            `${this.baseURL}/${resourceType}/${id}`
        );
        return res.status();
    }

    /** Return FHIR content headers */
    private fhirHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/fhir+json',
            Accept: 'application/fhir+json',
        };
    }

    /** Ensure POST returned 201; throw error otherwise */
    private async ensure201(res: APIResponse, resource: string): Promise<void> {
        if (res.status() !== 201) {
            const txt = await res.text();
            throw new Error(
                `Create ${resource} failed: ${res.status()} ${txt}`
            );
        }
    }
}
