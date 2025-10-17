import type { Encounter } from '../types/fhir.js';
import { FhirClient } from '../services/FhirClient.js';

export class EncounterObject {
    constructor(private readonly client: FhirClient) {}
    async create(body: Encounter): Promise<Encounter> {
        return this.client.create('Encounter', body);
    }
}
