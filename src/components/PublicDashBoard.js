// PublicDashboard.js
import React from 'react';
import Card from './Card';
import '../css/PublicDashBoard.css';
import friend from '../images/friend.jpg'
import support from '../images/support.jpg'
import secure from '../images/secure.jpg'

const PublicDashboard = ({ onLoginClick, onSignupClick}) => {
    const features = [
        {
            title: "User-Friendly Interface",
            content: "Our platform is designed for easy navigation and a seamless experience.",
            image: friend
        },
        {
            title: "24/7 Support",
            content: "We're always here to help with any issues or questions you may have.",
            image: support
        },
        {
            title: "Secure & Reliable",
            content: "Your data's security is our top priority. Trust in our robust infrastructure.",
            image: secure
        }
        // Add more features as needed
    ];

    return (
        <div className="public-dashboard">
            <section className="welcome-section">
                <h1>Welcome to Our Platform</h1>
                <p>Discover the endless possibilities and how we can make your life easier.</p>
            </section>

            <section className="features-section">
                {features.map((feature, index) => (
                    <Card 
                        key={index}
                        title={feature.title}
                        content={feature.content}
                        image={feature.image}
                    />
                ))}
            </section>

            <section className="call-to-action">
                <h2>Join Our Community</h2>
                <p>Sign up today and start enjoying all the benefits we offer.</p>
                <button onClick={onSignupClick}>Sign Up Now</button>
                <button onClick={onLoginClick}>Login</button>
            </section>
        </div>
    );
};

export default PublicDashboard;
