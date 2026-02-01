import React from 'react';
import DocumentUpload from '../components/DocumentUpload';
import DocumentList from '../components/DocumentList';

const Documents: React.FC = () => {
    return (
        <div>
            <h1>Document Management</h1>
            <DocumentUpload />
            <DocumentList />
        </div>
    );
};

export default Documents;