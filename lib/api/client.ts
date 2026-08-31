const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: string;
  email: string;
  display_name?: string;
  is_active: bool;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ProcessingJob {
  id: string;
  document_id: string;
  job_type: string;
  status: "UPLOADED" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  progress: number;
  error_message?: string;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  source_format: string;
  processing_status: "UPLOADED" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  uploaded_at: string;
  latest_job?: ProcessingJob;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("readable_token");
    }
    return null;
  }

  public setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("readable_token", token);
    }
  }

  public clearToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("readable_token");
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (_) {}
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth Methods
  public async register(email: string, password: string, display_name?: string): Promise<User> {
    return this.request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name }),
    });
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.access_token);
    return res;
  }

  public async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } finally {
      this.clearToken();
    }
  }

  public async getMe(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  // Document Methods
  public async uploadDocument(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<Document>("/documents", {
      method: "POST",
      body: formData,
    });
  }

  public async getDocuments(): Promise<Document[]> {
    return this.request<Document[]>("/documents");
  }

  public async getDocument(documentId: string): Promise<Document> {
    return this.request<Document>(`/documents/${documentId}`);
  }

  public async getDocumentSections(documentId: string): Promise<any[]> {
    return this.request<any[]>(`/documents/${documentId}/sections`);
  }

  public async getDocumentContent(documentId: string): Promise<{ document_id: string; title: string; total_sections: number; sections: any[] }> {
    return this.request<{ document_id: string; title: string; total_sections: number; sections: any[] }>(`/documents/${documentId}/content`);
  }

  public async deleteDocument(documentId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/documents/${documentId}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
