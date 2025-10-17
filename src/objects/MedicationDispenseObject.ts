import type { MedicationDispense } from '../types/fhir.js';
import { FhirClient } from '../services/FhirClient.js';

export class MedicationDispenseObject {
    constructor(private readonly client: FhirClient) {}
    async create(body: MedicationDispense): Promise<MedicationDispense> {
        return this.client.create('MedicationDispense', body);
    }
}
