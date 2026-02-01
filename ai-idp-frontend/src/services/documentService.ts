import { api } from './api';
import { Document, UploadResponse, ProcessingStatus } from '../types';

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/documents/upload', formData);
    return response.data;
};

export const fetchDocuments = async (): Promise<Document[]> => {
    const response = await api.get('/documents');
    return response.data;
};

export const checkProcessingStatus = async (documentId: string): Promise<ProcessingStatus> => {
    const response = await api.get(`/documents/${documentId}/status`);
    return response.data;
};