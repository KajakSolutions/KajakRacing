import React from 'react';
import './loadingscreen.scss';

interface LoadingScreenProps {
    progress: number;
    message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, message }) => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <h2>Kajak Racing</h2>
                <div className="loading-bar-container">
                    <div className="loading-bar">
                        <div
                            className="loading-bar-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="loading-percent">{Math.round(progress)}%</div>
                </div>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
