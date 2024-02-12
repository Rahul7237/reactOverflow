import React, { useState } from 'react';
import "../../css/AskQues.css";

const AskQues = ({ onClose, onSubmit }) => {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionBody, setQuestionBody] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title: questionTitle, body: questionBody, longitude: longitude, latitude: latitude , address: address});
  };
  if ("geolocation" in navigator) {
    // Get current position
    navigator.geolocation.getCurrentPosition(function(position) {
      // Access latitude and longitude from the position object
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      getCityFromLatLng(latitude, longitude);
      setLatitude(latitude);
      setLongitude(longitude);
      
      // Do something with latitude and longitude
      console.log("Latitude: " + latitude + ", Longitude: " + longitude);
    });
  } else {
    // Geolocation is not supported
    console.log("Geolocation is not supported by this browser.");
  }

  function getCityFromLatLng(latitude, longitude) {
    // Google Maps API endpoint for reverse geocoding
    var geocodeEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCl8OA_amJCTzSUvFDeLDkvITSbBhMDE9I`;
  
    // Make a GET request to the Google Maps Geocoding API
    fetch(geocodeEndpoint)
      .then(response => response.json())
      .then(data => {
        if (data.status === "OK") {
          // Loop through address components to find the city
          var city;
          for (var i = 0; i < data.results[0].address_components.length; i++) {
            var component = data.results[0].address_components[i];
            if (component.types.includes("locality")) {
              city = component.long_name;
              break;
            }
          }
          setAddress(city);
          console.log("City:", city);
        } else {
          console.log("Geocoding failed:", data.status);
        }
      })
      .catch(error => {
        console.error("Error fetching geocoding data:", error);
      });
  }
  return (
    <div className="ask-question-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit}>
          <label htmlFor="questionTitle">Title</label>
          <input
            type="text"
            id="questionTitle"
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
            required
          />
          <label htmlFor="questionBody">Your Question</label>
          <textarea
            id="questionBody"
            value={questionBody}
            onChange={(e) => setQuestionBody(e.target.value)}
            required
          />
          <button type="submit">Post Question</button>
        </form>
      </div>
    </div>
  );
};

export default AskQues;
