import { test, expect } from '@playwright/test';
import { FhirClient } from '../../src/services/FhirClient.js';
import { MedicationWorkflowSteps } from '../../src/objects/MedicationWorkflowSteps.js';
import { getBaseURL } from '../../src/utils/env.js';
import { debugLog } from '../../src/utils/logger.js';

const baseURL = getBaseURL();
debugLog(`\n🧩 [env] BASE_URL: ${baseURL}`);

test.describe('POM: FHIR MedicationRequest end-to-end', () => {
    test('creates Patient → Encounter → MedicationRequest → Dispense → Administration', async ({
        request,
    }) => {
        const client = new FhirClient(request, baseURL); // ✅ fixed
        const steps = new MedicationWorkflowSteps(client);

        const {
            patient,
            practitioner,
            encounter,
            medRequest,
            dispense,
            admin,
        } = await steps.runEndToEnd();

        expect(patient.id).toBeTruthy();
        expect(practitioner.id).toBeTruthy();
        expect(encounter.id).toBeTruthy();
        expect(medRequest.id).toBeTruthy();
        expect(dispense.id).toBeTruthy();
        expect(admin.id).toBeTruthy();

        // spot-check linking
        expect(medRequest.subject.reference).toBe(`Patient/${patient.id}`);
        expect(medRequest.encounter?.reference).toBe(
            `Encounter/${encounter.id}`
        );
    });
});
