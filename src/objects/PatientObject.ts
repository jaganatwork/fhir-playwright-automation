import type { Patient } from '../types/fhir.js';
import { FhirClient } from '../services/FhirClient.js';

export class PatientObject {
    constructor(private readonly client: FhirClient) {}
    async create(body: Patient): Promise<Patient> {
        return this.client.create('Patient', body);
    }
}
