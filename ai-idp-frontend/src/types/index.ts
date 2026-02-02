export type DocumentStatus = 'uploaded' | 'processing' | 'completed' | 'failed' | 'pending' | 'skipped';

export interface Document {
  id: number;
  filename: string;
  status: string;
  embedding_status: DocumentStatus;
  classification?: unknown;
  content_type: string;
  created_at: string;
  file_size?: number;
  upload_date?: string;
}

export interface UploadResponse extends Document {}

export interface DocumentStatusResponse extends Document {}

export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface SearchResult {
  document_id: number;
  score: number;
  snippet: string;
  classification?: string | null;
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface ApiError {
  detail: string;
}

// Auth interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id?: number;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username?: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}