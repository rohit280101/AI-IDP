import axios from 'axios';
import { settings } from '../config'; // Adjust the import based on your project structure

const apiClient = axios.create({
    baseURL: settings.API_BASE_URL, // Set your backend API base URL here
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getDocuments = async () => {
    try {
        const response = await apiClient.get('/documents');
        return response.data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
};

export const uploadDocument = async (formData) => {
    try {
        const response = await apiClient.post('/documents/upload', formData);
        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

export const getProcessingStatus = async (documentId) => {
    try {
        const response = await apiClient.get(`/documents/${documentId}/status`);
        return response.data;
    } catch (error) {
        console.error('Error fetching processing status:', error);
        throw error;
    }
};