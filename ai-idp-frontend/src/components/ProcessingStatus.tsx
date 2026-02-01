import React from 'react';

const ProcessingStatus: React.FC<{ status: string }> = ({ status }) => {
    return (
        <div className="processing-status">
            <h2>Processing Status</h2>
            {status === 'processing' && <p>Your document is currently being processed. Please wait...</p>}
            {status === 'completed' && <p>Your document has been processed successfully!</p>}
            {status === 'error' && <p>There was an error processing your document. Please try again.</p>}
            {status === 'idle' && <p>No document is currently being processed.</p>}
        </div>
    );
};

export default ProcessingStatus;