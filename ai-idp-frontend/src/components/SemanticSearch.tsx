import React, { useState } from 'react';
import { performSemanticSearch } from '../services/searchService';
import { SearchResult } from '../types';

interface SemanticSearchProps {
  onResultsFound?: (documentIds: number[]) => void;
}

const SemanticSearch: React.FC<SemanticSearchProps> = ({ onResultsFound }) => {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await performSemanticSearch(query, limit);
      setResults(response.results);

      if (onResultsFound) {
        onResultsFound(response.results.map((result) => result.document_id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Semantic Search</h2>
      <p style={styles.subtitle}>
        Search across all processed documents using natural language
      </p>

      <form onSubmit={handleSearch} style={styles.form}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            style={styles.searchInput}
            disabled={loading}
          />
          
          <div style={styles.limitControl}>
            <label style={styles.limitLabel}>Results:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              style={styles.limitSelect}
              disabled={loading}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              ...styles.searchButton,
              ...(loading || !query.trim() ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
          
          {hasSearched && (
            <button
              type="button"
              onClick={handleClear}
              style={styles.clearButton}
              disabled={loading}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div style={styles.errorMessage}>
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Searching documents...</p>
        </div>
      )}

      {!loading && hasSearched && !error && (
        <div style={styles.resultsContainer}>
          {results.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>No results found</p>
              <p style={styles.emptyStateSubtext}>
                Try a different query or check if documents are processed
              </p>
            </div>
          ) : (
            <>
              <div style={styles.resultsHeader}>
                <h3 style={styles.resultsTitle}>
                  Search Results
                </h3>
                <span style={styles.resultsCount}>
                  {results.length} document{results.length !== 1 ? 's' : ''} found
                </span>
              </div>

              <div style={styles.resultsList}>
                {results.map((result, index) => (
                  <div key={`${result.document_id}-${index}`} style={styles.resultItem}>
                    <div style={styles.resultRank}>#{index + 1}</div>
                    <div style={styles.resultContent}>
                      <div style={styles.resultId}>Document ID: {result.document_id}</div>
                      <div style={styles.resultSnippet}>{result.snippet}</div>
                      {result.classification && (
                        <div style={styles.resultClassification}>
                          Classification: {result.classification}
                        </div>
                      )}
                      <div style={styles.resultMeta}>
                        Relevance rank: {index + 1} of {results.length} · Score: {result.score.toFixed(4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.infoBox}>
                <strong>Note:</strong> Results are ranked by semantic similarity.
                Future versions will include text highlighting and preview.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '800px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '24px',
    fontSize: '14px',
  },
  form: {
    marginBottom: '24px',
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '250px',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  limitControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  limitLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  limitSelect: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  },
  searchButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 32px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  clearButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  errorMessage: {
    padding: '16px',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '6px',
    border: '1px solid #fcc',
    marginTop: '16px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px',
    marginTop: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#666',
    fontSize: '16px',
  },
  resultsContainer: {
    marginTop: '24px',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e0e0e0',
  },
  resultsTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
  },
  resultsCount: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer',
  },
  resultSnippet: {
    fontSize: '14px',
    color: '#444',
    marginTop: '6px',
  },
  resultClassification: {
    fontSize: '12px',
    color: '#007bff',
    marginTop: '6px',
  },
  resultRank: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    minWidth: '50px',
    textAlign: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultId: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  resultMeta: {
    fontSize: '14px',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyStateText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '8px',
  },
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#999',
  },
  infoBox: {
    padding: '16px',
    backgroundColor: '#e7f3ff',
    border: '1px solid #b3d9ff',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#004085',
  },
};

export default SemanticSearch;
