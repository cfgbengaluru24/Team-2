import React, { useState, useEffect } from 'react';
import './Analysis.css';
import Modal from './Modal/Modal';

const Analysis = () => {
    const [showNGO, setShowNGO] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [soilData, setSoilData] = useState(null);
    const [ngoData, setNgoData] = useState([]);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const lat = queryParams.get('lat');
            const lng = queryParams.get('lng');

            try {
                const response = await fetch(`http://localhost:3005/get-user?lat=${lat}&lng=${lng}`);
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, []);

    const fetchNGOData = async () => {
        try {
            const response = await fetch('http://localhost:3005/get-ngos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNgoData(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleNGOButtonClick = () => {
        setShowNGO(true);
        fetchNGOData();
    };

    const handleAnalysisButtonClick = async () => {
        setShowAnalysis(true);

        const lat = new URLSearchParams(window.location.search).get('lat');
        const lon = new URLSearchParams(window.location.search).get('lng');

        if (!lat || !lon) {
            alert("Please enter both latitude and longitude.");
            return;
        }

        const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=bdod&property=clay&property=nitrogen&property=phh2o&property=sand&property=silt&depth=0-5cm`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();

            if (data && data.properties && data.properties.layers) {
                setSoilData(data.properties.layers);
            } else {
                setSoilData(null);
            }

        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            alert("Failed to retrieve soil data. Please try again.");
        }
    };

    const handleAccept = async () => {
        try {
            await fetch('http://localhost:3005/send-telegram-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'This is an automated message sent by the bot.' })
            });
            setModalTitle('Accepted');
            setModalContent('Accepted and message sent');
            setShowModal(true);
            window.location.href = `/dashboard`;
        } catch (error) {
            console.error('Error sending message', error);
            setModalTitle('Error');
            setModalContent('Accepted but failed to send message');
            setShowModal(true);
        }
    };

    const handleReject = async () => {
        const lat = new URLSearchParams(window.location.search).get('lat');
        const lng = new URLSearchParams(window.location.search).get('lng');

        if (!lat || !lng) {
            alert("Latitude and Longitude are required to delete the location.");
            return;
        }

        try {
            setModalTitle('Rejected');
            setModalContent('Rejected and message not sent');
            setShowModal(true);
            window.location.href = `/dashboard`;
        } catch (error) {
            console.error('Error deleting location', error);
            alert('Failed to delete location');
        }
    };

    const renderSoilData = () => {
        if (!soilData) {
            return <p>No soil data available.</p>;
        }
    
        return soilData.map((layer, index) => (
            <div key={index}>
                <h3>{layer.name}</h3>
                {layer.depths.map((depth, depthIndex) => (
                    <div key={depthIndex}>
                        <p>Mean Value: {depth.values.mean || 'N/A'}</p>
                        {/* Render additional properties if needed */}
                    </div>
                ))}
            </div>
        ));
    };

    if (error) {
        return <div className="container"><p>{error}</p></div>;
    }

    if (!user) {
        return <div className="container"><p>Loading...</p></div>;
    }

    return (
        <div className="container">
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={modalTitle}
            >
                <p>{modalContent}</p>
            </Modal>
            <div className="user-card">
                <img src={user.image} alt={`${user.name}'s avatar`} className="user-image" />
                <h2 className="user-name">{user.name}</h2>
                <p className="user-location">Location: {user.location}</p>
            </div>
            <div className="button-group">
                <button 
                    onClick={handleNGOButtonClick} 
                    className="btn btn-blue"
                >
                    Show NGO
                </button>
                <button 
                    onClick={handleAnalysisButtonClick} 
                    className="btn btn-green"
                >
                    Smart Analysis
                </button>
            </div>
            {showNGO && (
                <div className="ngo-details card">
                    <h2 className="card-title">NGO Details</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>NGO Name</th>
                                <th>Location</th>
                                <th>Contact Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ngoData.map((ngo, index) => (
                                <tr key={index}>
                                    <td>{ngo.name}</td>
                                    <td>{ngo.location}</td>
                                    <td>{ngo.contactNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="action-buttons">
                        <button onClick={handleAccept} className="btn btn-green">Accept</button>
                        <button onClick={handleReject} className="btn btn-red">Reject</button>
                    </div>
                </div>
            )}
            {showAnalysis && (
                <div className="analysis-details card">
                    <h2 className="card-title">Smart Analysis</h2>
                    {renderSoilData()}
                </div>
            )}
        </div>
    );
};

export default Analysis;
