import React, { useEffect, useState } from 'react';
import { fetchDocuments } from '../services/documentService';
import { Document } from '../types';

const DocumentList: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const fetchedDocuments = await fetchDocuments();
                setDocuments(fetchedDocuments);
            } catch (err) {
                setError('Failed to fetch documents');
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, []);

    if (loading) {
        return <div>Loading documents...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Uploaded Documents</h2>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.id}>
                        {doc.title} - {doc.uploadedAt}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentList;