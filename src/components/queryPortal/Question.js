import React, { useState, useEffect, useCallback } from 'react';
import '../../css/Question.css';
import { BaseURL } from '../../Keys';
const Question = ({ title, quesDesc, firstName, lastName, createDate, questionId, tokenValue, user , address}) => {
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [allAnswers, setAllAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [location, setLocation] = useState('');
  const formattedDate = new Date(createDate).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric'
  });

  const formattedAnswerDate = (answerDate) => {
    return new Date(answerDate).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric'
    });
  };

  const handlePostAnswer = async () => {
    if (newAnswer.trim() !== '') {
      try {
        const response = await fetch({ BaseURL } +'/query/addAns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenValue}`,
          },
          body: JSON.stringify({
            quesId: questionId,
            ansDesc: newAnswer,
            userId: user?.userId || null,
            latitude: latitude,
            longitude: longitude,
            address: location
          }),
        });

        if (response.ok) {
          // Fetch updated answers after posting
          await fetchAnswers();
          setNewAnswer('');
          setShowAnswerBox(false); // Hide the textarea after posting an answer
        } else {
          console.error('Failed to post answer');
        }
      } catch (error) {
        console.error('Error posting answer:', error);
      }
    }
  };

  const fetchAnswers = useCallback(async () => {
    try {
      const response = await fetch({ BaseURL } + `/query/ansbyQuesId/${questionId}`, {
        headers: {
          'Authorization': `Bearer ${tokenValue}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllAnswers(data || []);
      } else {
        console.error('Failed to fetch answers');
        setError('Failed to fetch answers');
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
      setError('Error fetching answers');
    } finally {
      setLoading(false);
    }
  }, [questionId, tokenValue]);

  useEffect(() => {
    fetchAnswers();
  }, [fetchAnswers]);

  const handleShowAnswerBox = () => {
    setShowAnswerBox(true);
  };

  const handleShowAllAnswers = () => {
    setShowAllAnswers(!showAllAnswers);
  };

  const handleCancelAnswer = () => {
    setNewAnswer('');
    setShowAnswerBox(false);
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
          setLocation(city);
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
    <div className="question">
      <div className="header">
        <h3>{title} </h3>
        <h5><i class="fas fa-globe-americas " ></i>{" " + address}</h5>
      </div>

      <p className="description">{quesDesc}</p>
     
      <div className="author">
        <p>Asked by {firstName} {lastName}</p>
        <p className="author-Date">{formattedDate}</p>
      </div>
      <p>{allAnswers.length} Answer(s)</p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="answers">
          {showAllAnswers
            ? allAnswers.map(answer => (
              <div key={answer.id} className="answer">
                <div className='answer-box'>
                  <p className="answer-text">{answer.answer_desc || 'No answer description available'} </p>
                  <p className='author'>
                    <p>{answer.firstName || 'Unknown'} {answer.lastName || ''} 
                    </p> 
                    <p className='author-Date'>{formattedAnswerDate(answer.createDate)}
                    <h5><i class="fas fa-globe-americas " ></i>{" " + answer.location}</h5>
                    </p>
                  </p>
                </div>
              </div>
            ))
            : allAnswers.slice(0, 2).map(answer => (
              <div key={answer.id} className="answer">
                <div className='answer-box'>
                  <p className="answer-text">{answer.answer_desc || 'No answer description available'}  </p>
                  <p className='author'>
                    <p>{answer.firstName || 'Unknown'} {answer.lastName || ''} 
                    </p> 
                    <p className='author-Date'>{formattedAnswerDate(answer.createDate)}
                   
                    </p>
                    <h5><i class="fas fa-globe-americas " ></i>{" " + answer.location}</h5>
                  </p>
                </div>
              </div>
            ))
          }

          {allAnswers.length > 2 && (
            <a href="#!" onClick={handleShowAllAnswers}>
              {showAllAnswers ? 'View Less' : 'View More Answers'}
            </a>
          )}
        </div>
      )}

      {!showAnswerBox && (
        <button className="ques-button" onClick={handleShowAnswerBox}>
          Give Your Answer
        </button>
      )}

      {showAnswerBox && (
        <div>
          <textarea className='answer-textArea'
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
          <div className="ques-button">
            <button className="answer-buttons" onClick={handlePostAnswer}>Post Answer</button>
            <button className="answer-buttons" onClick={handleCancelAnswer}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
