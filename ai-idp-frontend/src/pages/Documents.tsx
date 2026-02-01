import React, { useState } from 'react';
import DocumentUpload from '../components/DocumentUpload';
import DocumentList from '../components/DocumentList';
import ProcessingStatus from '../components/ProcessingStatus';

const Documents: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeDocumentId, setActiveDocumentId] = useState<number | null>(null);

  const handleUploadSuccess = (documentId: number) => {
    setActiveDocumentId(documentId);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDocumentSelect = (documentId: number) => {
    setActiveDocumentId(documentId);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Document Management</h1>
        <p style={styles.subtitle}>Upload and manage your PDF documents</p>
      </header>

      <div style={styles.content}>
        <div style={styles.uploadSection}>
          <DocumentUpload onUploadSuccess={handleUploadSuccess} />
          
          {activeDocumentId && (
            <div style={styles.statusSection}>
              <ProcessingStatus
                documentId={activeDocumentId}
                onStatusChange={(status) => {
                  if (status === 'completed' || status === 'failed') {
                    setRefreshTrigger((prev) => prev + 1);
                  }
                }}
              />
            </div>
          )}
        </div>

        <div style={styles.listSection}>
          <DocumentList
            refreshTrigger={refreshTrigger}
            onDocumentSelect={handleDocumentSelect}
          />
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '30px',
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  statusSection: {
    marginTop: '20px',
  },
  listSection: {
    minHeight: '400px',
  },
};

export default Documents;