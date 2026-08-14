"use client";

import { useState, type FormEvent } from "react";
import type { ChatMessage, DocumentType, FieldValues } from "@/lib/types";
import { fetchDocumentType, sendDocumentChatMessage } from "@/lib/documentsApi";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I can help you put together a legal document from our template library " +
    "— things like an NDA, a services agreement, a DPA, and more. What are you " +
    "trying to create?",
};

interface DocumentChatProps {
  onDocumentChange: (document: DocumentType | null) => void;
  onFieldsChange: (fields: FieldValues) => void;
}

export default function DocumentChat({ onDocumentChange, onFieldsChange }: DocumentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [documentKey, setDocumentKey] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const { reply, documentType, fields } = await sendDocumentChatMessage(nextMessages);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
      onFieldsChange(fields);

      if (documentType && documentType !== documentKey) {
        setDocumentKey(documentType);
        onDocumentChange(await fetchDocumentType(documentType));
      }
    } catch {
      setError("The assistant is unavailable right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[70vh] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div key={index} className={message.role === "user" ? "text-right" : "text-left"}>
            <span
              className={
                "inline-block max-w-[85%] rounded-lg px-3 py-2 text-left text-sm " +
                (message.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800")
              }
            >
              {message.content}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-left text-sm text-gray-400">Thinking…</div>}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          placeholder="Type your answer…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
