import {
    test,
    expect,
    request as playwrightRequest,
    APIRequestContext,
} from '@playwright/test';
import { FhirClient } from '../../src/services/FhirClient.js';
import { MedicationRequestObject } from '../../src/objects/MedicationRequestObject.js';
import { getBaseURL } from '../../src/utils/env.js';
import { debugLog } from '../../src/utils/logger.js';
import type { MedicationRequest } from '../../src/types/fhir.js';

test.describe('FHIR MedicationRequest CRUD Workflow', () => {
    let medReqObj: MedicationRequestObject;
    let medReqId = '';
    let apiContext: APIRequestContext;

    const sampleMedRequest: MedicationRequest = {
        resourceType: 'MedicationRequest',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: {
            coding: [
                {
                    system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                    code: '834060',
                    display: 'Penicillin V Potassium 250 MG',
                },
            ],
        },
        subject: { reference: 'Patient/example' },
        requester: { reference: 'Practitioner/example' },
        authoredOn: new Date().toISOString(),
    };

    test.beforeAll(async () => {
        const baseURL = getBaseURL();
        apiContext = await playwrightRequest.newContext({ baseURL });
        const client = new FhirClient(apiContext, baseURL);
        medReqObj = new MedicationRequestObject(client);
    });

    test.afterAll(async () => {
        await apiContext.dispose(); // ✅ close context after all tests
    });

    test('should create, get, update, and delete MedicationRequest', async () => {
        // CREATE
        const created = await medReqObj.create(sampleMedRequest);
        expect(created.status).toBe('active');
        medReqId = created.id!;
        debugLog('CREATE', { id: medReqId });

        // READ
        const fetched = await medReqObj.get(medReqId);
        expect(fetched.id).toBe(medReqId);
        debugLog('READ', { id: fetched.id ?? 'N/A' });

        // PATCH
        const updated = await medReqObj.updateStatus(medReqId, 'on-hold');
        expect(updated.status).toBe('on-hold');
        debugLog('PATCH', { status: updated.status });

        // DELETE
        const status = await medReqObj.delete(medReqId);
        expect([200, 204]).toContain(status);
        debugLog('DELETE', { id: medReqId });
    });
});
