// LoginSignup.js
import React, { useState, useEffect } from 'react';
import '../css/LoginSignup.css';
import { BaseURL } from '../Keys';
const LoginSignup = ({ mode, onModeChange, onClose, success, handletoken }) => {
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch({BaseURL} + '/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
          email: signUpData.email,
          mobile: signUpData.mobile,
          password: signUpData.password
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Signup successful:', data);

      onClose();
      const user = {
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        mobile: data.user.mobile,
        userId: data.user.id
      };
      success(user);

      // Store user details in a cookie with a 7-day expiration
      document.cookie = `userDetails=${JSON.stringify(user)}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;

      // Store JWT token in a separate cookie with a 7-day expiration
      document.cookie = `jwtToken=${data.jwt}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;

      // Pass the token to the parent component
      handletoken(data.jwt);
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Signup failed. Please try again.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch({BaseURL} +'/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.email,
          password: loginData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      onClose();
      const user = {
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        mobile: data.user.mobile,
        userId: data.user.id
      };
      success(user);

      // Store user details in a cookie with a 7-day expiration
      document.cookie = `userDetails=${JSON.stringify(user)}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;

      // Store JWT token in a separate cookie with a 7-day expiration
      document.cookie = `jwtToken=${data.jwt}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;

      // Pass the token to the parent component
      handletoken(data.jwt);
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  useEffect(() => {
    // Check if the user is already logged in (by checking cookies)
    const storedUserDetails = getCookie('userDetails');
    const storedToken = getCookie('jwtToken');

    if (storedUserDetails && storedToken) {
      console.log('User details are already available:', JSON.parse(storedUserDetails));
      // Optionally, you might want to fetch additional user details using the stored user information

      // Set user details directly in the success function
      success(JSON.parse(storedUserDetails));
    }
  }, [success]);

  return (
    <div className="login-card">
      {mode === 'login' && (
        <div>
          Log in
          <form onSubmit={handleLoginSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleLoginChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleLoginChange} />
            <button type="submit">Log In</button>
          </form>
          <button onClick={() => onModeChange('signup')}>Sign Up</button>
        </div>
      )}

      {mode === 'signup' && (
        <div>
          Sign Up
          <form onSubmit={handleSignUpSubmit}>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleSignUpChange} />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleSignUpChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleSignUpChange} />
            <input type="text" name="mobile" placeholder="Mobile Number" onChange={handleSignUpChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleSignUpChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleSignUpChange} />
            {error && <p className="error">{error}</p>}
            <button type="submit">Sign Up</button>
          </form>
          <button onClick={() => onModeChange('login')}>Log In</button>
        </div>
      )}
    </div>
  );
};

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

export default LoginSignup;
