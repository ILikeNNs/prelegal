import type { ChatMessage, DocumentType, FieldValues } from "./types";

// Empty in production, where the static export is served same-origin by
// FastAPI; set to the backend's dev URL via .env.local for `npm run dev`.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export interface DocumentChatReply {
  reply: string;
  documentType: string | null;
  fields: FieldValues;
}

export async function sendDocumentChatMessage(messages: ChatMessage[]): Promise<DocumentChatReply> {
  const response = await fetch(`${API_BASE_URL}/api/document-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error("The assistant is unavailable right now. Please try again.");
  }

  return response.json();
}

export async function fetchDocumentType(key: string): Promise<DocumentType> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${encodeURIComponent(key)}`);

  if (!response.ok) {
    throw new Error("Could not load the document template.");
  }

  return response.json();
}
