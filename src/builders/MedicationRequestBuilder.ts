import type {
    MedicationRequest,
    CodeableConcept,
    Reference,
} from '../types/fhir.js';

export class MedicationRequestBuilder {
    private _status: MedicationRequest['status'] = 'active';
    private _intent: MedicationRequest['intent'] = 'order';
    private _med: CodeableConcept = {
        coding: [
            {
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                code: '834060',
                display: 'Penicillin V Potassium 250 MG',
            },
        ],
    };
    private _subject!: Reference;
    private _encounter?: Reference;
    private _requester?: Reference;
    private _authoredOn?: string;

    status(v: MedicationRequest['status']): this {
        this._status = v;
        return this;
    }

    intent(v: MedicationRequest['intent']): this {
        this._intent = v;
        return this;
    }

    medication(v: CodeableConcept): this {
        this._med = v;
        return this;
    }

    subject(v: Reference): this {
        this._subject = v;
        return this;
    }

    encounter(v: Reference): this {
        this._encounter = v;
        return this;
    }

    requester(v: Reference): this {
        this._requester = v;
        return this;
    }

    authoredOn(v: string): this {
        this._authoredOn = v;
        return this;
    }

    build(): MedicationRequest {
        if (!this._subject)
            throw new Error('MedicationRequest.subject is required');

        return {
            resourceType: 'MedicationRequest',
            status: this._status,
            intent: this._intent,
            medicationCodeableConcept: this._med,
            subject: this._subject,
            ...(this._encounter ? { encounter: this._encounter } : {}),
            ...(this._requester ? { requester: this._requester } : {}),
            ...(this._authoredOn ? { authoredOn: this._authoredOn } : {}),
        };
    }
}
