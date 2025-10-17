import { FhirClient } from '../services/FhirClient.js';
import { PatientObject } from './PatientObject.js';
import { PractitionerObject } from './PractitionerObject.js';
import { EncounterObject } from './EncounterObject.js';
import { MedicationRequestObject } from './MedicationRequestObject.js';
import { MedicationDispenseObject } from './MedicationDispenseObject.js';
import { MedicationAdministrationObject } from './MedicationAdministrationObject.js';
import { ref } from '../utils/refs.js';
import { MedicationRequestBuilder } from '../builders/MedicationRequestBuilder.js';
import {
    makePatient,
    makePractitioner,
    makeEncounter,
} from '../builders/simple.js';
import type {
    Patient,
    Practitioner,
    Encounter,
    MedicationDispense,
    MedicationAdministration,
    MedicationRequest,
} from '../types/fhir.js';

export interface MedicationWorkflowResult {
    patient: Patient;
    practitioner: Practitioner;
    encounter: Encounter;
    medRequest: MedicationRequest;
    dispense: MedicationDispense;
    admin: MedicationAdministration;
}
export class MedicationWorkflowSteps {
    private readonly patients: PatientObject;
    private readonly practitioners: PractitionerObject;
    private readonly encounters: EncounterObject;
    private readonly medReqs: MedicationRequestObject;
    private readonly medDispenses: MedicationDispenseObject;
    private readonly medAdmins: MedicationAdministrationObject;

    constructor(private readonly client: FhirClient) {
        this.patients = new PatientObject(this.client);
        this.practitioners = new PractitionerObject(this.client);
        this.encounters = new EncounterObject(this.client);
        this.medReqs = new MedicationRequestObject(this.client);
        this.medDispenses = new MedicationDispenseObject(this.client);
        this.medAdmins = new MedicationAdministrationObject(this.client);
    }

    async runEndToEnd(
        nowISO = new Date().toISOString()
    ): Promise<MedicationWorkflowResult> {
        {
            // 1) Patient
            const patientBody: Patient = makePatient();
            const patient = await this.patients.create(patientBody);

            // 2) Practitioner
            const practitionerBody: Practitioner = makePractitioner();
            const practitioner =
                await this.practitioners.create(practitionerBody);

            // 3) Encounter
            const encounterBody: Encounter = makeEncounter(
                ref('Patient', patient.id!).reference
            );
            const encounter = await this.encounters.create(encounterBody);

            // 4) MedicationRequest
            const mr = new MedicationRequestBuilder()
                .subject(ref('Patient', patient.id!))
                .encounter(ref('Encounter', encounter.id!))
                .requester(ref('Practitioner', practitioner.id!))
                .authoredOn(nowISO)
                .build();

            const medRequest = await this.medReqs.create(mr);

            // 5) MedicationDispense
            const medDispense: MedicationDispense = {
                resourceType: 'MedicationDispense',
                status: 'completed',
                medicationCodeableConcept: mr.medicationCodeableConcept,
                subject: ref('Patient', patient.id!),
                authorizingPrescription: [
                    { reference: `MedicationRequest/${medRequest.id}` },
                ],
            };
            const dispense = await this.medDispenses.create(medDispense);

            // 6) MedicationAdministration
            const medAdmin: MedicationAdministration = {
                resourceType: 'MedicationAdministration',
                status: 'completed',
                medicationCodeableConcept: mr.medicationCodeableConcept,
                subject: ref('Patient', patient.id!),
                request: ref('MedicationRequest', medRequest.id!),
                effectiveDateTime: nowISO,
            };
            const admin = await this.medAdmins.create(medAdmin);

            return {
                patient,
                practitioner,
                encounter,
                medRequest,
                dispense,
                admin,
            };
        }
    }
}
