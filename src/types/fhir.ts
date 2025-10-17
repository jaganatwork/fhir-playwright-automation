export type Id = string;

export interface Coding {
    system?: string;
    code?: string;
    display?: string;
}

export interface CodeableConcept {
    coding?: Coding[];
    text?: string;
}

export interface Reference {
    reference: string; // e.g. "Patient/123"
    display?: string;
}

export interface ResourceBase {
    resourceType: string;
    id?: Id;
}

export interface Patient extends ResourceBase {
    resourceType: 'Patient';
    active?: boolean;
    name?: Array<{ use?: string; family?: string; given?: string[] }>;
    gender?: 'male' | 'female' | 'other' | 'unknown';
    birthDate?: string;
}

export interface Practitioner extends ResourceBase {
    resourceType: 'Practitioner';
    active?: boolean;
    name?: Array<{ family?: string; given?: string[]; prefix?: string[] }>;
}

export interface Encounter extends ResourceBase {
    resourceType: 'Encounter';
    status:
        | 'planned'
        | 'in-progress'
        | 'finished'
        | 'cancelled'
        | 'entered-in-error'
        | 'on-hold'
        | 'stopped'
        | 'unknown';
    class: { system: string; code: string; display?: string };
    subject: Reference;
}

export interface MedicationRequest extends ResourceBase {
    resourceType: 'MedicationRequest';
    status:
        | 'active'
        | 'completed'
        | 'draft'
        | 'entered-in-error'
        | 'stopped'
        | 'on-hold'
        | 'cancelled'
        | 'unknown';
    intent:
        | 'order'
        | 'plan'
        | 'original-order'
        | 'reflex-order'
        | 'filler-order'
        | 'instance-order'
        | 'option';
    medicationCodeableConcept: CodeableConcept;
    subject: Reference;
    encounter?: Reference;
    authoredOn?: string;
    requester?: Reference;
}

export interface MedicationDispense extends ResourceBase {
    resourceType: 'MedicationDispense';
    status:
        | 'preparation'
        | 'in-progress'
        | 'cancelled'
        | 'on-hold'
        | 'completed'
        | 'entered-in-error'
        | 'stopped'
        | 'declined'
        | 'unknown';
    medicationCodeableConcept: CodeableConcept;
    subject: Reference;
    authorizingPrescription?: Array<Reference>;
}

export interface MedicationAdministration extends ResourceBase {
    resourceType: 'MedicationAdministration';
    status:
        | 'in-progress'
        | 'on-hold'
        | 'completed'
        | 'entered-in-error'
        | 'stopped'
        | 'unknown'
        | 'not-done';
    medicationCodeableConcept: CodeableConcept;
    subject: Reference;
    request?: Reference;
    effectiveDateTime?: string;
}
