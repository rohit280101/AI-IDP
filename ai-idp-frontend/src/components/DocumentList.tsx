import React, { useEffect, useState } from 'react';
import { fetchDocuments } from '../services/documentService';
import { Document } from '../types';

interface DocumentListProps {
  refreshTrigger?: number;
  onDocumentSelect?: (documentId: number) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ refreshTrigger, onDocumentSelect }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      if (documents.length === 0) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);
      const fetchedDocuments = await fetchDocuments();
      setDocuments(fetchedDocuments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [refreshTrigger]);

  const getStatusBadge = (status?: string) => {
    const statusStyles: { [key: string]: React.CSSProperties } = {
      uploaded: { backgroundColor: '#ffc107', color: '#000' },
      pending: { backgroundColor: '#ffc107', color: '#000' },
      processing: { backgroundColor: '#17a2b8', color: '#fff' },
      completed: { backgroundColor: '#28a745', color: '#fff' },
      failed: { backgroundColor: '#dc3545', color: '#fff' },
      skipped: { backgroundColor: '#6c757d', color: '#fff' },
    };

    const resolvedStatus = status || 'uploaded';
    const resolvedStyle = statusStyles[resolvedStatus] || statusStyles.uploaded;

    return (
      <span style={{ ...styles.badge, ...resolvedStyle }}>
        {resolvedStatus.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}>Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>⚠️ {error}</div>
        <button onClick={loadDocuments} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <p>No documents uploaded yet.</p>
          <p style={styles.emptyStateSubtext}>Upload a PDF to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Documents</h2>
        <button onClick={loadDocuments} style={styles.refreshButton}>
          {isRefreshing ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>Filename</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Classification</th>
              <th style={styles.tableHeader}>Size</th>
              <th style={styles.tableHeader}>Upload Date</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const statusValue = doc.embedding_status || doc.status || 'uploaded';
              const sizeText = typeof doc.file_size === 'number'
                ? `${(doc.file_size / 1024).toFixed(2)} KB`
                : '-';
              const uploadDate = doc.created_at || doc.upload_date;
              const classificationText = doc.classification
                ? (typeof doc.classification === 'string'
                    ? doc.classification
                    : JSON.stringify(doc.classification))
                : '-';

              return (
              <tr
                key={doc.id}
                style={styles.tableRow}
                onClick={() => onDocumentSelect && onDocumentSelect(doc.id)}
              >
                <td style={styles.tableCell}>{doc.filename}</td>
                <td style={styles.tableCell}>{getStatusBadge(statusValue)}</td>
                <td style={styles.tableCell}>
                  {classificationText !== '-' ? (
                    <span style={styles.classificationTag}>{classificationText}</span>
                  ) : (
                    <span style={styles.noneText}>-</span>
                  )}
                </td>
                <td style={styles.tableCell}>{sizeText}</td>
                <td style={styles.tableCell}>
                  {uploadDate ? new Date(uploadDate).toLocaleString() : '-'}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  refreshButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#f8f9fa',
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6',
  },
  tableRow: {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  classificationTag: {
    backgroundColor: '#e7f3ff',
    color: '#0066cc',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  noneText: {
    color: '#999',
  },
  loadingSpinner: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  errorMessage: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '4px',
    border: '1px solid #fcc',
    marginBottom: '10px',
  },
  retryButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: '14px',
  },
};

export default DocumentList;