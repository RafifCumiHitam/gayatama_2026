"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient, Document, User } from "@/lib/api/client";
import { FileText, Upload, Trash2, LogOut, CheckCircle, Clock } from "lucide-react";

export default function DocumentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchUserData = async () => {
    try {
      const currentUser = await apiClient.getMe();
      setUser(currentUser);
      const docs = await apiClient.getDocuments();
      setDocuments(docs);
    } catch (err: any) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    setError("");

    try {
      const newDoc = await apiClient.uploadDocument(file);
      router.push(`/documents/${newDoc.id}/processing`);
    } catch (err: any) {
      setError(err.message || "Failed to upload document.");
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await apiClient.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err: any) {
      alert(err.message || "Failed to delete document.");
    }
  };

  const handleLogout = async () => {
    await apiClient.logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream-bg)] flex items-center justify-center">
        <p className="text-stone-600">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream-bg)] text-[var(--charcoal,#2d2825)]">
      {/* Header */}
      <header className="border-b border-[var(--taupe-border,#e5e0d8)] bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-xl font-bold text-stone-900 font-[family-name:var(--font-opendyslexic)]">
            ReadAble
          </Link>
          <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded">Workspace</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-stone-700">
            {user?.display_name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900 font-[family-name:var(--font-opendyslexic)]">
              Your Documents
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Upload PDF documents to transform them into customized accessible reading formats.
            </p>
          </div>

          <label className="cursor-pointer bg-stone-900 text-amber-50 px-5 py-2.5 rounded-lg hover:bg-stone-800 transition-colors flex items-center space-x-2 text-sm font-medium">
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Uploading..." : "Upload PDF"}</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {documents.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-300 rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-1">No documents yet</h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
              Upload your first PDF document to parse structure and begin reading with customized typography and focus rulers.
            </p>
            <label className="inline-flex items-center space-x-2 cursor-pointer bg-stone-900 text-amber-50 px-4 py-2 rounded-lg hover:bg-stone-800 text-sm font-medium">
              <Upload className="w-4 h-4" />
              <span>Select PDF File</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          /* Document Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => router.push(`/documents/${doc.id}/processing`)}
                className="bg-white border border-stone-200 rounded-xl p-5 hover:border-amber-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <FileText className="w-8 h-8 text-amber-800 shrink-0" />
                    <button
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-medium text-stone-900 truncate mb-1" title={doc.original_filename}>
                    {doc.original_filename}
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    {(doc.file_size / (1024 * 1024)).toFixed(2)} MB • {doc.source_format}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-1.5 text-stone-600">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{doc.processing_status}</span>
                  </span>
                  <span className="text-amber-900 font-medium hover:underline">
                    View &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
