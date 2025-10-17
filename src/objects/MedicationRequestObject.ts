import type { MedicationRequest } from '../types/fhir.js';
import { FhirClient } from '../services/FhirClient.js';

export class MedicationRequestObject {
    constructor(private readonly client: FhirClient) {}
    async create(body: MedicationRequest): Promise<MedicationRequest> {
        return this.client.create('MedicationRequest', body);
    }
}
