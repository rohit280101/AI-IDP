import React, { useEffect, useState } from 'react';
import { fetchDocumentStatus } from '../services/documentService';
import { DocumentStatus } from '../types';

interface ProcessingStatusProps {
  documentId: number;
  onStatusChange?: (status: DocumentStatus) => void;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ documentId, onStatusChange }) => {
  const [status, setStatus] = useState<DocumentStatus>('uploaded');
  const [classification, setClassification] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let isMounted = true;

    const checkStatus = async () => {
      try {
        const response = await fetchDocumentStatus(documentId);
        
        if (!isMounted) return;

        setStatus(response.embedding_status);
        setClassification(response.classification);
        setLoading(false);
        setError(null);

        if (onStatusChange) {
          onStatusChange(response.embedding_status);
        }

        // Stop polling if completed or failed
        if (response.embedding_status === 'completed' || response.embedding_status === 'failed') {
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch status');
        setLoading(false);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 3 seconds
    intervalId = setInterval(checkStatus, 3000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [documentId, onStatusChange]);

  const getStatusDisplay = () => {
    const statusConfig: Record<DocumentStatus, { label: string; icon: string; color: string }> = {
      uploaded: { label: 'Uploaded', icon: '📄', color: '#ffc107' },
      processing: { label: 'Processing', icon: '⚙️', color: '#17a2b8' },
      completed: { label: 'Completed', icon: '✓', color: '#28a745' },
      failed: { label: 'Failed', icon: '✗', color: '#dc3545' },
    };

    return statusConfig[status] || statusConfig.uploaded;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}>Loading status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>⚠️ {error}</div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay();

  return (
    <div style={styles.container}>
      <div style={styles.statusCard}>
        <div style={styles.statusHeader}>
          <span style={{ ...styles.statusIcon, color: statusDisplay.color }}>
            {statusDisplay.icon}
          </span>
          <h3 style={styles.statusTitle}>Document Status</h3>
        </div>

        <div style={styles.statusBody}>
          <div style={styles.statusRow}>
            <span style={styles.label}>Current Status:</span>
            <span style={{ ...styles.statusBadge, backgroundColor: statusDisplay.color }}>
              {statusDisplay.label}
            </span>
          </div>

          {classification && (
            <div style={styles.statusRow}>
              <span style={styles.label}>Classification:</span>
              <span style={styles.classificationValue}>{classification}</span>
            </div>
          )}

          {status === 'processing' && (
            <div style={styles.processingInfo}>
              <div style={styles.loadingBar}>
                <div style={styles.loadingBarFill} />
              </div>
              <p style={styles.processingText}>
                Processing document... This may take a few moments.
              </p>
            </div>
          )}

          {status === 'completed' && (
            <div style={styles.successInfo}>
              ✓ Document has been successfully processed and is ready for search.
            </div>
          )}

          {status === 'failed' && (
            <div style={styles.failedInfo}>
              ✗ Document processing failed. Please try uploading again.
            </div>
          )}
        </div>

        <div style={styles.timeline}>
          <div style={{ ...styles.timelineStep, ...styles.timelineStepActive }}>
            <div style={{ ...styles.timelineDot, ...styles.timelineDotActive }} />
            <span style={styles.timelineLabel}>Uploaded</span>
          </div>
          <div style={styles.timelineLine} />
          <div
            style={{
              ...styles.timelineStep,
              ...(status === 'processing' || status === 'completed' ? styles.timelineStepActive : {}),
            }}
          >
            <div
              style={{
                ...styles.timelineDot,
                ...(status === 'processing' || status === 'completed' ? styles.timelineDotActive : {}),
              }}
            />
            <span style={styles.timelineLabel}>Processing</span>
          </div>
          <div style={styles.timelineLine} />
          <div
            style={{
              ...styles.timelineStep,
              ...(status === 'completed' ? styles.timelineStepActive : {}),
            }}
          >
            <div
              style={{
                ...styles.timelineDot,
                ...(status === 'completed' ? styles.timelineDotActive : {}),
              }}
            />
            <span style={styles.timelineLabel}>Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '600px',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '24px',
  },
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  statusIcon: {
    fontSize: '32px',
    marginRight: '12px',
  },
  statusTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
  },
  statusBody: {
    marginBottom: '24px',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  classificationValue: {
    backgroundColor: '#e7f3ff',
    color: '#0066cc',
    padding: '6px 12px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  processingInfo: {
    marginTop: '20px',
  },
  loadingBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e0e0e0',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  loadingBarFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#17a2b8',
    animation: 'loading 1.5s ease-in-out infinite',
  },
  processingText: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
  },
  successInfo: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    border: '1px solid #c3e6cb',
  },
  failedInfo: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
  },
  timeline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #e0e0e0',
  },
  timelineStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 0.4,
  },
  timelineStepActive: {
    opacity: 1,
  },
  timelineDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
    marginBottom: '8px',
  },
  timelineDotActive: {
    backgroundColor: '#007bff',
  },
  timelineLabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#555',
  },
  timelineLine: {
    flex: 1,
    height: '2px',
    backgroundColor: '#e0e0e0',
    margin: '0 8px 20px 8px',
  },
  spinner: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  errorMessage: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '4px',
    border: '1px solid #fcc',
  },
};

export default ProcessingStatus;