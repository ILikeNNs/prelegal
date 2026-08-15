"use client";

import { useState } from "react";
import DocumentChat from "@/components/DocumentChat";
import DocumentPreview from "@/components/DocumentPreview";
import type { DocumentType, FieldValues } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function Home() {
  const { user } = useRequireAuth();
  const [activeDocument, setActiveDocument] = useState<DocumentType | null>(null);
  const [fields, setFields] = useState<FieldValues>({});

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="no-print border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-brand-navy">
          {activeDocument?.name ?? "Legal Document Creator"}
        </h1>
        <p className="text-sm text-brand-gray">
          Chat with the assistant about what you need and it will fill in a completed document for you to download.
        </p>
      </div>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[380px_1fr]">
        <section className="no-print rounded-lg border border-gray-200 bg-white p-6">
          <DocumentChat onDocumentChange={setActiveDocument} onFieldsChange={setFields} />
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="no-print mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-brand-navy">Preview</h2>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md bg-brand-purple px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              disabled={!activeDocument}
            >
              Download PDF
            </button>
          </div>
          <DocumentPreview document={activeDocument} fields={fields} />
        </section>
      </main>
    </div>
  );
}
