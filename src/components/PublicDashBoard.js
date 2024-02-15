// PublicDashboard.js
import React from 'react';
import Slider from 'react-slick';
import Card from './Card';
import '../css/PublicDashBoard.css';
import friend from '../images/friend.jpg'
import support from '../images/support.jpg'
import secure from '../images/secure.jpg'
import manthinking from '../images/Man-thinking-pana.png'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PublicDashboard = ({ onLoginClick, onSignupClick}) => {
    const features = [
        {
            title: "User-Friendly Interface",
            content: "Our platform is designed for easy navigation and a seamless experience.",
            image: friend
        },
        {
            title: "User-Friendly Interface",
            content: "Our platform is designed for easy navigation and a seamless experience.",
            image: manthinking
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

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 3000, // Set the interval between slides in milliseconds
    };

    return (
        <div className="public-dashboard">
            <section className="welcome-section">
                <h1>Welcome to Our Platform</h1>
                <p>Discover the endless possibilities and how we can make your life easier.</p>
            </section>

            <section className="features-section">
                <Slider {...settings}>
                    {features.map((feature, index) => (
                        <div key={index}>
                            <Card 
                                title={feature.title}
                                content={feature.content}
                                image={feature.image}
                            />
                        </div>
                    ))}
                </Slider>
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
