import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { standardTerms } from "@/data/standardTerms";
import { buildCoverPage } from "@/lib/buildCoverPage";
import type { NdaFormData } from "@/lib/types";

interface DocumentPreviewProps {
  data: NdaFormData;
}

export default function DocumentPreview({ data }: DocumentPreviewProps) {
  const coverPage = buildCoverPage(data);

  return (
    <article className="nda-document prose prose-sm max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {coverPage}
      </ReactMarkdown>
      <div className="page-break" />
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {standardTerms}
      </ReactMarkdown>
    </article>
  );
}
