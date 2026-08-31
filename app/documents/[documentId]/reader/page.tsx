"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiClient, Document } from "@/lib/api/client";
import { ArrowLeft, BookOpen, Sliders, Volume2, ShieldAlert } from "lucide-react";

export default function DocumentReaderPage() {
  const params = useParams();
  const documentId = params.documentId as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reading accommodation controls
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [letterSpacing, setLetterSpacing] = useState(0.5);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [activeTab, setActiveTab] = useState<"read" | "settings">("read");

  useEffect(() => {
    if (documentId) {
      apiClient
        .getDocument(documentId)
        .then((doc) => setDocument(doc))
        .catch((err) => setError(err.message || "Failed to load document."))
        .finally(() => setLoading(false));
    }
  }, [documentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream-bg)] flex items-center justify-center">
        <p className="text-stone-600">Loading reader...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-[var(--cream-bg)] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-semibold text-stone-900 mb-2">Error Loading Document</h2>
        <p className="text-sm text-stone-600 mb-6">{error || "Document not found."}</p>
        <Link href="/documents" className="px-4 py-2 bg-stone-900 text-amber-50 rounded-lg text-sm font-medium">
          Back to Documents
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream-bg)] text-[var(--charcoal,#2d2825)] flex flex-col">
      {/* Top Reader Navbar */}
      <header className="border-b border-stone-200 bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Link href="/documents" className="text-stone-600 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-medium text-stone-900 truncate max-w-md">
            {document.original_filename}
          </span>
          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-mono">
            {document.processing_status}
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-stone-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("read")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === "read" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reader View</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center space-x-1.5 ${
              activeTab === "settings" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Accommodations</span>
          </button>
        </div>
      </header>

      {/* Main Reader View */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12">
        {activeTab === "settings" ? (
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm max-w-lg mx-auto space-y-6">
            <h2 className="text-lg font-semibold text-stone-900 border-b pb-3">Reading Accommodations</h2>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-2">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              >
                <option value="Inter">Inter (Sans-serif)</option>
                <option value="var(--font-opendyslexic)">OpenDyslexic</option>
                <option value="Georgia">Georgia (Serif)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Font Size</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-amber-800"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Line Height</span>
                <span>{lineHeight}</span>
              </div>
              <input
                type="range"
                min="1.2"
                max="2.5"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className="w-full accent-amber-800"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                <span>Letter Spacing</span>
                <span>{letterSpacing}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.2"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className="w-full accent-amber-800"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-xl p-8 md:p-12 shadow-sm min-h-[600px]">
            {/* Status notice */}
            <div className="p-4 mb-8 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Phase 0 Status Notice</span>
                Document parsing and text extraction will be implemented in Phase 1. The custom reading preferences configured above will apply to extracted document sections.
              </div>
            </div>

            {/* Configured Text Display Container */}
            <div
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}px`,
                fontFamily: fontFamily,
              }}
              className="space-y-6 text-stone-800"
            >
              <h1 className="text-2xl font-bold text-stone-900 border-b pb-4">
                {document.original_filename}
              </h1>

              <p className="text-stone-600 italic text-sm">
                (Document sections will populate here once PDF extraction is executed in Phase 1.)
              </p>

              <div className="p-6 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                <h3 className="font-semibold text-stone-900 text-base">Example Accessible Accommodation Text</h3>
                <p>
                  ReadAble transforms documents into structured semantic sections, allowing readers to dynamically adjust line spacing, typography, and contrast themes according to individual cognitive accessibility preferences.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
