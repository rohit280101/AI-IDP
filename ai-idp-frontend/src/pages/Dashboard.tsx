import React, { useEffect, useState } from 'react';
import SemanticSearch from '../components/SemanticSearch';
import { fetchDocuments } from '../services/documentService';
import { Document } from '../types';

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (documentIds: number[]) => {
    const resultDocs = documents.filter((doc) => documentIds.includes(doc.id));
    setSearchResults(resultDocs);
  };

  const stats = {
    total: documents.length,
    completed: documents.filter((d) => d.embedding_status === 'completed').length,
    processing: documents.filter((d) => d.embedding_status === 'processing').length,
    failed: documents.filter((d) => d.embedding_status === 'failed').length,
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Search and analyze your documents</p>
      </header>

      {!loading && (
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, ...styles.statCardPrimary }}>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Total Documents</div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardSuccess }}>
            <div style={styles.statValue}>{stats.completed}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardInfo }}>
            <div style={styles.statValue}>{stats.processing}</div>
            <div style={styles.statLabel}>Processing</div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statCardDanger }}>
            <div style={styles.statValue}>{stats.failed}</div>
            <div style={styles.statLabel}>Failed</div>
          </div>
        </div>
      )}

      <div style={styles.searchSection}>
        <SemanticSearch onResultsFound={handleSearchResults} />
      </div>

      {searchResults.length > 0 && (
        <div style={styles.resultsDetails}>
          <h3 style={styles.resultsTitle}>Document Details</h3>
          <div style={styles.resultsGrid}>
            {searchResults.map((doc) => (
              <div key={doc.id} style={styles.documentCard}>
                <div style={styles.documentHeader}>
                  <h4 style={styles.documentFilename}>{doc.filename}</h4>
                  <span style={styles.documentId}>ID: {doc.id}</span>
                </div>
                {doc.classification && (
                  <div style={styles.documentClassification}>
                    <strong>Classification:</strong> {doc.classification}
                  </div>
                )}
                <div style={styles.documentMeta}>
                  <div>Size: {(doc.file_size / 1024).toFixed(2)} KB</div>
                  <div>Uploaded: {new Date(doc.upload_date).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    padding: '24px',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'white',
  },
  statCardPrimary: {
    backgroundColor: '#007bff',
  },
  statCardSuccess: {
    backgroundColor: '#28a745',
  },
  statCardInfo: {
    backgroundColor: '#17a2b8',
  },
  statCardDanger: {
    backgroundColor: '#dc3545',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
  searchSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    marginBottom: '30px',
  },
  resultsDetails: {
    marginTop: '30px',
  },
  resultsTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  documentCard: {
    padding: '20px',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  documentHeader: {
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e0e0e0',
  },
  documentFilename: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    wordBreak: 'break-word',
  },
  documentId: {
    fontSize: '12px',
    color: '#666',
    backgroundColor: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  documentClassification: {
    marginBottom: '12px',
    fontSize: '14px',
  },
  documentMeta: {
    fontSize: '12px',
    color: '#666',
    display: 'flex',
    justifyContent: 'space-between',
  },
};

export default Dashboard;