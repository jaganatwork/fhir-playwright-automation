import type { Reference } from '../types/fhir.js';

export const ref = (type: string, id: string): Reference => ({
    reference: `${type}/${id}`,
});
