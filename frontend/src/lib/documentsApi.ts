import type { ChatMessage, DocumentDetail, DocumentSummary, DocumentType, FieldValues } from "./types";

// Empty in production, where the static export is served same-origin by
// FastAPI; set to the backend's dev URL via .env.local for `npm run dev`.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export interface DocumentChatReply {
  reply: string;
  documentType: string | null;
  fields: FieldValues;
  documentId: number | null;
}

export async function sendDocumentChatMessage(
  messages: ChatMessage[],
  documentId: number | null
): Promise<DocumentChatReply> {
  const response = await fetch(`${API_BASE_URL}/api/document-chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, documentId }),
  });

  if (!response.ok) {
    throw new Error("The assistant is unavailable right now. Please try again.");
  }

  return response.json();
}

export async function fetchDocumentType(key: string): Promise<DocumentType> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${encodeURIComponent(key)}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not load the document template.");
  }

  return response.json();
}

export async function fetchHistory(): Promise<DocumentSummary[]> {
  const response = await fetch(`${API_BASE_URL}/api/history`, { credentials: "include" });

  if (!response.ok) {
    throw new Error("Could not load your document history.");
  }

  return response.json();
}

export async function fetchHistoryDetail(id: number): Promise<DocumentDetail> {
  const response = await fetch(`${API_BASE_URL}/api/history/${id}`, { credentials: "include" });

  if (!response.ok) {
    throw new Error("Could not load that document.");
  }

  return response.json();
}
