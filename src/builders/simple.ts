import type { Patient, Practitioner, Encounter } from '../types/fhir.js';

export const makePatient = (overrides: Partial<Patient> = {}): Patient => ({
    resourceType: 'Patient',
    active: true,
    name: [{ use: 'official', family: 'Appleseed', given: ['John'] }],
    gender: 'male',
    birthDate: '1955-03-14',
    ...overrides,
});

export const makePractitioner = (
    overrides: Partial<Practitioner> = {}
): Practitioner => ({
    resourceType: 'Practitioner',
    active: true,
    name: [{ family: 'Careful', given: ['Adam'], prefix: ['Dr'] }],
    ...overrides,
});

export const makeEncounter = (
    subjectRef: string,
    overrides: Partial<Encounter> = {}
): Encounter => ({
    resourceType: 'Encounter',
    status: 'finished',
    class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'Ambulatory',
    },
    subject: { reference: subjectRef },
    ...overrides,
});
