import type { ChatMessage, NdaFields } from "./types";

// Empty in production, where the static export is served same-origin by
// FastAPI; set to the backend's dev URL via .env.local for `npm run dev`.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export interface NdaChatReply {
  reply: string;
  fields: NdaFields;
}

export async function sendNdaChatMessage(messages: ChatMessage[]): Promise<NdaChatReply> {
  const response = await fetch(`${API_BASE_URL}/api/nda-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error("The assistant is unavailable right now. Please try again.");
  }

  return response.json();
}
