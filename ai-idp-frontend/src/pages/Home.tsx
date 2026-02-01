import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the AI-IDP Application</h1>
            <p>This application allows you to manage your documents efficiently.</p>
            <h2>Features:</h2>
            <ul>
                <li>
                    <Link to="/documents">Upload and manage documents</Link>
                </li>
                <li>
                    <Link to="/dashboard">View processing statistics</Link>
                </li>
            </ul>
        </div>
    );
};

export default Home;