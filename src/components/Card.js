// Card.js
import React from 'react';
import '../css/Card.css';

const Card = ({ image, title, content }) => {
    return (
        <div className="card">
            {image && <img src={image} alt={title} className="card-image" />}
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-text">{content}</p>
            </div>
        </div>
    );
};

export default Card;
