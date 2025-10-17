import type { MedicationAdministration } from '../types/fhir.js';
import { FhirClient } from '../services/FhirClient.js';

export class MedicationAdministrationObject {
    constructor(private readonly client: FhirClient) {}
    async create(
        body: MedicationAdministration
    ): Promise<MedicationAdministration> {
        return this.client.create('MedicationAdministration', body);
    }
}
