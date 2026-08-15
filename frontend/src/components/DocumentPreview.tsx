import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { DISCLAIMER_TEXT } from "@/lib/disclaimer";
import { renderCoverPage } from "@/lib/renderTemplate";
import type { DocumentType, FieldValues } from "@/lib/types";

interface DocumentPreviewProps {
  document: DocumentType | null;
  fields: FieldValues;
}

export default function DocumentPreview({ document, fields }: DocumentPreviewProps) {
  if (!document) {
    return (
      <p className="text-sm text-gray-500">
        Tell the assistant what kind of document you need, and a preview will appear here as you go.
      </p>
    );
  }

  const fieldLabels = Object.fromEntries(document.fields.map((field) => [field.name, field.label]));
  const coverPage = renderCoverPage(document.coverPageTemplate, fields, fieldLabels);

  return (
    <article className="nda-document prose prose-sm max-w-none">
      <p className="rounded-md border border-brand-yellow bg-brand-yellow/10 px-3 py-2 text-xs text-brand-navy not-prose">
        {DISCLAIMER_TEXT}
      </p>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {coverPage}
      </ReactMarkdown>
      <div className="page-break" />
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {document.standardTerms}
      </ReactMarkdown>
    </article>
  );
}
