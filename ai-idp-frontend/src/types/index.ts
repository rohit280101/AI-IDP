export interface Document {
    id: string;
    title: string;
    uploadDate: string;
    status: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    document?: Document;
}

export interface ProcessingStatus {
    documentId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    message?: string;
}