export type MndaTermOption = "expires" | "untilTerminated";
export type ConfidentialityTermOption = "years" | "perpetuity";

export interface NdaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermOption: MndaTermOption;
  mndaTermYears: number;
  confidentialityTermOption: ConfidentialityTermOption;
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
  party1Company: string;
  party2Company: string;
  modifications: string;
}

export const DEFAULT_NDA_FORM_DATA: NdaFormData = {
  purpose: "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: "",
  mndaTermOption: "expires",
  mndaTermYears: 1,
  confidentialityTermOption: "years",
  confidentialityTermYears: 1,
  governingLaw: "",
  jurisdiction: "",
  party1Company: "",
  party2Company: "",
  modifications: "",
};

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** The AI's best-known value for each field, or null if not mentioned yet. */
export type NdaFields = { [K in keyof NdaFormData]: NdaFormData[K] | null };

/**
 * Each chat reply carries the AI's complete best-known state of every field
 * (reconstructed from the whole conversation), so this always starts from
 * the defaults rather than merging onto whatever was there before.
 */
export function mergeNdaFields(fields: NdaFields): NdaFormData {
  return {
    purpose: fields.purpose ?? DEFAULT_NDA_FORM_DATA.purpose,
    effectiveDate: fields.effectiveDate ?? DEFAULT_NDA_FORM_DATA.effectiveDate,
    mndaTermOption: fields.mndaTermOption ?? DEFAULT_NDA_FORM_DATA.mndaTermOption,
    mndaTermYears: fields.mndaTermYears ?? DEFAULT_NDA_FORM_DATA.mndaTermYears,
    confidentialityTermOption:
      fields.confidentialityTermOption ?? DEFAULT_NDA_FORM_DATA.confidentialityTermOption,
    confidentialityTermYears:
      fields.confidentialityTermYears ?? DEFAULT_NDA_FORM_DATA.confidentialityTermYears,
    governingLaw: fields.governingLaw ?? DEFAULT_NDA_FORM_DATA.governingLaw,
    jurisdiction: fields.jurisdiction ?? DEFAULT_NDA_FORM_DATA.jurisdiction,
    party1Company: fields.party1Company ?? DEFAULT_NDA_FORM_DATA.party1Company,
    party2Company: fields.party2Company ?? DEFAULT_NDA_FORM_DATA.party2Company,
    modifications: fields.modifications ?? DEFAULT_NDA_FORM_DATA.modifications,
  };
}
