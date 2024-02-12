// InterestingFactComponent.jsx
import React, { useState } from 'react';
import '../css/InterestingFactComponent.css';

const InterestingFactComponent = () => {
  const [category, setCategory] = useState('random');
  const [inputValue, setInputValue] = useState('');
  const [fact, setFact] = useState(null);

  const fetchFact = async () => {
    let url;

    switch (category) {
      case 'math':
        url = `https://numbersapi.p.rapidapi.com/${inputValue}/math`;
        break;
      case 'date':
        url = `https://numbersapi.p.rapidapi.com/${inputValue}/date`;
        break;
      case 'random':
        url = 'https://numbersapi.p.rapidapi.com/random/trivia';
        break;
      case 'year':
        url = `https://numbersapi.p.rapidapi.com/${inputValue}/year`;
        break;
      default:
        // Default to random fact
        url = 'https://numbersapi.p.rapidapi.com/random/trivia';
    }

    const params = {
      min: '10',
      max: '20',
      fragment: 'true',
      json: 'true',
    };

    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;

    const headers = {
      'X-RapidAPI-Key': 'd423b89267msh6a6d59e6e1dd224p1f0bbfjsn292fbe0107bb',
      'X-RapidAPI-Host': 'numbersapi.p.rapidapi.com',
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        setFact(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const renderInput = () => {
      if (category === 'random') {
        return null;
      }
  
      const inputLabel =
        category === 'year' ? 'Enter Year (YYYY):' : category === 'math' ? 'Enter a Number:' : 'Select Date (DD/MM):';
  
      return (
        <div className="input-container">
          <label htmlFor="inputValue">{inputLabel}</label>
          {category === 'date' ? (
            <input
              type="text"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="DD/MM"
              maxLength="5"
            />
          ) : category === 'year' ? (
            <input
              type="text"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="YYYY"
              maxLength="4"
            />
          ) : category === 'math' ? (
            <input
              type="number"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a Number"
            />
          ) : (
            <input
              type="text"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}
        </div>
      );
    };
  
    return (
      <div className="interesting-fact-container">
        <h2>Explore Interesting Facts</h2>
        <div className="select-category">
          <label htmlFor="category">Select Category:</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="math">Math Fact</option>
            <option value="date">Date Fact</option>
            <option value="random">Random Fact</option>
            <option value="year">Year Fact</option>
          </select>
        </div>
        {renderInput()}
        <button className="fetch-button" onClick={fetchFact}>
          Get Fact
        </button>
        {fact && (
          <div className="fact-card">
            <p className="fact-text">{fact.text}</p>
            <p className="fact-number">Number: {fact.number}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default InterestingFactComponent;