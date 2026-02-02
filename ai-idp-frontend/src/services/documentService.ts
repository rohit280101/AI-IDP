import { api } from './api';
import { Document, UploadResponse, DocumentStatusResponse } from '../types';
import type { AxiosProgressEvent } from 'axios';

export const uploadDocument = async (
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadResponse>('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const fetchDocuments = async (): Promise<Document[]> => {
  const response = await api.get<Document[]>('/documents');
  return response.data;
};

export const fetchDocumentStatus = async (documentId: number): Promise<DocumentStatusResponse> => {
  const response = await api.get<DocumentStatusResponse>(`/documents/${documentId}`);
  return response.data;
};