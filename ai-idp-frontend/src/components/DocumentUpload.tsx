import React, { useState, useRef } from 'react';
import { uploadDocument } from '../services/documentService';

interface DocumentUploadProps {
  onUploadSuccess?: (documentId: number, filename: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = files[0];
    
    // PDF-only validation
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      const response = await uploadDocument(selectedFile, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        setUploadProgress(percentCompleted);
      });

      setSuccess(`Successfully uploaded: ${response.filename}`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUploadSuccess) {
        onUploadSuccess(response.id, response.filename);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Document</h2>
      
      <div style={styles.uploadBox}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
          style={styles.fileInput}
        />
        
        {selectedFile && (
          <p style={styles.selectedFile}>
            Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          style={{
            ...styles.button,
            ...((!selectedFile || uploading) && styles.buttonDisabled),
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {uploading && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${uploadProgress}%`,
                }}
              />
            </div>
            <span style={styles.progressText}>{uploadProgress}%</span>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={styles.successMessage}>
            ✓ {success}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '600px',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  uploadBox: {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center',
  },
  fileInput: {
    marginBottom: '15px',
    padding: '10px',
    width: '100%',
  },
  selectedFile: {
    margin: '15px 0',
    color: '#555',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  progressContainer: {
    marginTop: '20px',
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '5px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '14px',
    color: '#555',
  },
  errorMessage: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '4px',
    border: '1px solid #fcc',
  },
  successMessage: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#efe',
    color: '#0a0',
    borderRadius: '4px',
    border: '1px solid #cfc',
  },
};

export default DocumentUpload;