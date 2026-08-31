"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient, Document } from "@/lib/api/client";
import { Clock, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function DocumentProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocumentStatus = async () => {
    try {
      const doc = await apiClient.getDocument(documentId);
      setDocument(doc);
    } catch (err: any) {
      setError(err.message || "Document not found or unauthorized.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchDocumentStatus();
    }
  }, [documentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream-bg)] flex items-center justify-center">
        <p className="text-stone-600">Checking document status...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-[var(--cream-bg)] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-semibold text-stone-900 mb-2">Error Loading Document</h2>
        <p className="text-sm text-stone-600 mb-6">{error || "Unable to locate document."}</p>
        <Link href="/documents" className="px-4 py-2 bg-stone-900 text-amber-50 rounded-lg text-sm font-medium">
          Back to Documents
        </Link>
      </div>
    );
  }

  const job = document.latest_job;

  return (
    <div className="min-h-screen bg-[var(--cream-bg)] text-[var(--charcoal,#2d2825)] p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/documents" className="inline-flex items-center space-x-2 text-stone-600 hover:text-stone-900 text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Documents</span>
        </Link>

        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-amber-100 text-amber-900 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-stone-900 font-[family-name:var(--font-opendyslexic)]">
                {document.original_filename}
              </h1>
              <p className="text-xs text-stone-500">
                Document ID: {document.id}
              </p>
            </div>
          </div>

          <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-900 tracking-wider uppercase">
                Current Status
              </span>
              <span className="px-2.5 py-1 text-xs font-medium bg-amber-200 text-amber-950 rounded-full">
                {document.processing_status}
              </span>
            </div>
            <p className="text-sm text-stone-700">
              Waiting for document processing. The deterministic PDF parsing engine will process this file in Phase 1.
            </p>
          </div>

          <div className="space-y-3 text-xs text-stone-600 bg-stone-50 p-4 rounded-lg border border-stone-200 mb-6">
            <div className="flex justify-between">
              <span>Job Type:</span>
              <span className="font-mono">{job?.job_type || "PARSE_PDF"}</span>
            </div>
            <div className="flex justify-between">
              <span>Job State:</span>
              <span className="font-mono">{job?.status || "QUEUED"}</span>
            </div>
            <div className="flex justify-between">
              <span>Uploaded At:</span>
              <span>{new Date(document.uploaded_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={fetchDocumentStatus}
              className="inline-flex items-center space-x-2 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Status</span>
            </button>

            <Link
              href={`/documents/${document.id}/reader`}
              className="px-4 py-2 bg-stone-900 text-amber-50 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Open Reader Preview &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
