export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface FieldOption {
  key: string;
  text: string;
}

export interface FieldSpec {
  name: string;
  label: string;
  description: string;
  type: "text" | "choice";
  options: FieldOption[];
}

/** Mirrors backend.documents.DocumentType. */
export interface DocumentType {
  key: string;
  name: string;
  description: string;
  fields: FieldSpec[];
  coverPageTemplate: string;
  standardTerms: string;
}

/** The AI's best-known value for each field of the active document, or null. */
export type FieldValues = Record<string, string | null>;
