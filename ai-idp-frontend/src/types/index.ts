export type DocumentStatus = 'uploaded' | 'processing' | 'completed' | 'failed';

export interface Document {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  embedding_status: DocumentStatus;
  classification?: string;
  raw_text?: string;
  cleaned_text?: string;
}

export interface UploadResponse {
  message: string;
  document_id: number;
  filename: string;
}

export interface DocumentStatusResponse {
  id: number;
  filename: string;
  embedding_status: DocumentStatus;
  classification?: string;
}

export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface SearchResponse {
  results: number[];
}

export interface ApiError {
  detail: string;
}

// Auth interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id?: number;
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
  logout: () => void;
}