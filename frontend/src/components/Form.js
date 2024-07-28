import React from 'react';

const handleSubmit = (e) => {
    e.preventDefault();
    alert('Submitted successfully!');
    window.location.href = '/';
};

const Form = () => {
    return (
        <div className="form-box login">
            <h2 style={{ textAlign: 'center' }}>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <span className="icon"></span>
                    <input type="number" />
                    <label>Date</label>
                </div>
                <div className="input-box">
                    <span className="icon"></span>
                    <input type="text" />
                    <label>Location</label>
                </div>
                <div className="input-box">
                    <span className="icon"></span>
                    <input type="number" />
                    <label>Labour Days</label>
                </div>
                <div className="input-box">
                    <span className="icon"></span>
                    <input type="number" />
                    <label>Machine time</label>
                </div>
                <div className="input-box">
                    <span className="icon"></span>
                    <input type="number" />
                    <label>Biomass</label>
                </div>
                <div className="input-box">
                    <span className="icon"></span>
                    <input type="number" />
                    <label>Area</label>
                </div>
                <button type="submit" className="btn">Submit</button>
            </form>
        </div>
    );
};

export default Form;
