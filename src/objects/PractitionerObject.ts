import type { Practitioner } from '../types/fhir.js';
import { FhirClient } from '../services/FhirClient.js';

export class PractitionerObject {
    constructor(private readonly client: FhirClient) {}
    async create(body: Practitioner): Promise<Practitioner> {
        return this.client.create('Practitioner', body);
    }
}
