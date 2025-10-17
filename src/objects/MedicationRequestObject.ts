import type { MedicationRequest } from '../types/fhir.js';
import { FhirClient } from '../services/FhirClient.js';

export class MedicationRequestObject {
    constructor(private readonly client: FhirClient) {}
    async create(body: MedicationRequest): Promise<MedicationRequest> {
        return this.client.create('MedicationRequest', body);
    }
    async get(id: string): Promise<MedicationRequest> {
        return this.client.read('MedicationRequest', id);
    }
    async updateStatus(
        id: string,
        newStatus: string
    ): Promise<MedicationRequest> {
        const patchBody = [
            { op: 'replace', path: '/status', value: newStatus },
        ];
        return this.client.patch('MedicationRequest', id, patchBody);
    }
    async delete(id: string): Promise<number> {
        return this.client.delete('MedicationRequest', id);
    }
}
