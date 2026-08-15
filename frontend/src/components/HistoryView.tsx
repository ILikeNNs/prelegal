"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DocumentPreview from "@/components/DocumentPreview";
import { fetchDocumentType, fetchHistory, fetchHistoryDetail } from "@/lib/documentsApi";
import type { DocumentDetail, DocumentSummary, DocumentType } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";

export default function HistoryView() {
  const { user } = useRequireAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!user) {
    return null;
  }

  return id ? <HistoryDetail id={Number(id)} /> : <HistoryList />;
}

function HistoryList() {
  const [items, setItems] = useState<DocumentSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setItems)
      .catch(() => setError("Could not load your document history."));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold text-brand-navy">Your documents</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!error && items === null && <p className="text-sm text-brand-gray">Loading…</p>}
      {items && items.length === 0 && (
        <p className="text-sm text-brand-gray">
          You haven&apos;t started any documents yet.{" "}
          <Link href="/" className="text-brand-blue hover:underline">
            Start one now
          </Link>
          .
        </p>
      )}
      {items && items.length > 0 && (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/history?id=${item.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <span className="font-medium text-brand-navy">
                  {item.documentName ?? "Untitled document"}
                </span>
                <span className="text-xs text-brand-gray">
                  {new Date(item.updatedAt).toLocaleString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HistoryDetail({ id }: { id: number }) {
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistoryDetail(id)
      .then(async (item) => {
        setDetail(item);
        if (item.documentTypeKey) {
          setDocumentType(await fetchDocumentType(item.documentTypeKey));
        }
      })
      .catch(() => setError("Could not load that document."));
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link href="/history" className="no-print text-sm text-brand-blue hover:underline">
        ← Back to your documents
      </Link>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {detail && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-8">
          <div className="no-print mb-6 flex items-center justify-between">
            <h1 className="text-lg font-medium text-brand-navy">
              {detail.documentName ?? "Untitled document"}
            </h1>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md bg-brand-purple px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Download PDF
            </button>
          </div>
          <DocumentPreview document={documentType} fields={detail.fields} />
        </div>
      )}
    </div>
  );
}
