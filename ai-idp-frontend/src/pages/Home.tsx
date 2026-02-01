import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>AI-Powered Intelligent Document Processing</h1>
        <p style={styles.subtitle}>
          Upload, process, and search your PDF documents with advanced AI capabilities
        </p>
      </div>

      <div style={styles.features}>
        <h2 style={styles.featuresTitle}>Features</h2>
        <div style={styles.featureGrid}>
          <Link to="/documents" style={styles.featureCard}>
            <div style={styles.featureIcon}>📄</div>
            <h3 style={styles.featureCardTitle}>Document Management</h3>
            <p style={styles.featureCardText}>
              Upload and manage your PDF documents with real-time processing status
            </p>
          </Link>

          <Link to="/dashboard" style={styles.featureCard}>
            <div style={styles.featureIcon}>🔍</div>
            <h3 style={styles.featureCardTitle}>Semantic Search</h3>
            <p style={styles.featureCardText}>
              Search across all documents using natural language queries
            </p>
          </Link>

          <div style={{ ...styles.featureCard, ...styles.featureCardInactive }}>
            <div style={styles.featureIcon}>🤖</div>
            <h3 style={styles.featureCardTitle}>AI Classification</h3>
            <p style={styles.featureCardText}>
              Automatic document classification and text extraction
            </p>
          </div>
        </div>
      </div>

      <div style={styles.quickStart}>
        <h2 style={styles.quickStartTitle}>Quick Start</h2>
        <ol style={styles.steps}>
          <li style={styles.step}>Upload a PDF document</li>
          <li style={styles.step}>Wait for automatic processing and classification</li>
          <li style={styles.step}>Search and retrieve documents semantically</li>
        </ol>
        <Link to="/documents" style={styles.ctaButton}>
          Get Started →
        </Link>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '60px',
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    color: 'white',
  },
  title: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '18px',
    opacity: 0.9,
  },
  features: {
    marginBottom: '60px',
  },
  featuresTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'center',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  featureCard: {
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  featureCardInactive: {
    cursor: 'default',
    opacity: 0.7,
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  featureCardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  featureCardText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  },
  quickStart: {
    backgroundColor: '#f8f9fa',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  quickStartTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  steps: {
    textAlign: 'left',
    maxWidth: '500px',
    margin: '0 auto 32px',
    fontSize: '16px',
    lineHeight: '2',
  },
  step: {
    marginBottom: '8px',
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '14px 40px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
};

export default Home;