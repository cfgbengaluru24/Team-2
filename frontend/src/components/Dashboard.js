import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:3005/get-image');
      setImages(response.data);
    } catch (error) {
      console.error("There was an error fetching the images!", error.response);
    }
  };

  const handleButtonClick = (location) => {
    const [lat, lng] = location.split(",");
    window.location.href = `/analysis?lat=${lat}&lng=${lng}`;
  };

  return (
    <div className="table-container">
      <h1>Admin Dashboard</h1>
      <table className="table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Image</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, index) => (
            <tr key={image._id}>
              <td>{index + 1}</td>
              <td>{image.name}</td>
              <td>
                <img
                  src={image.image}
                  alt={image.name}
                  className="image"
                />
              </td>
              <td>{image.location}</td>
              <td>
                <button
                  onClick={() => handleButtonClick(image.location)}
                  className="action-button"
                >
                  Action
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
