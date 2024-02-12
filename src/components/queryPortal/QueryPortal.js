import React, { useState, useEffect } from 'react';
import Question from './Question';
import AskQues from './AskQues';
import '../../css/QueryPortal.css';
import { BaseURL } from '../../Keys';
const QueryPortal = ({ user, tokenValue }) => {
  const [questions, setQuestions] = useState([]);
  const [askMode, setAskMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${BaseURL}/query/ques`, {
          headers: {
            'Authorization': `Bearer ${tokenValue}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Error fetching questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [tokenValue]); // Include token in the dependency array

  const handleAskMode = () => {
    setAskMode(!askMode);
  };

  const handleNewQuestionSubmit = async (quesDesc) => {
    try {
      const addedQuestion = await apiAddQuestion(quesDesc);
      setQuestions([...questions, addedQuestion]);
      setAskMode(false);
    } catch (error) {
      console.error('Error while adding a question:', error);
      setError('Error adding a question');
    }
  };

  const apiAddQuestion = async (ques) => {
    try {
      const newQuestion = {
        email: user.email,
        quesDesc: ques.body,
        quesTitle: ques.title,
        latitude: ques.latitude,
        longitude: ques.longitude,
        address: ques.address
      };
console.log( "loaction" + ques.location);
      const response = await fetch(`${BaseURL}/query/addques`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenValue}`,
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    } catch (error) {
      console.error('Error while posting a question:', error);
      throw error;
    }
  };

  return (
    <div className="community-queries">
      <h1>Community Questions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>

          {askMode && (
            <AskQues onSubmit={handleNewQuestionSubmit} onClose={() => setAskMode(false)} />
          )}
          <div className="questions-list">
            {questions.map((question) => (
              <Question
                key={question.id}
                questionId={question.id}
                title={question.quesTitle}
                answers={question.answerId}
                quesDesc={question.quesDesc}
                firstName={question.firstName}
                lastName={question.lastName}
                createDate={question.createDate}
                tokenValue={tokenValue}
                user={user}
                address={question.location}
              />
            ))}
          </div>
        </>
      )}
      {/* Floating "Ask Question" button */}
      <button className="floating-button" onClick={handleAskMode}>
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

export default QueryPortal;
