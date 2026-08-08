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
