import React, { useState, useEffect } from 'react';
import '../css/LoginSignup.css';
import { BaseURL } from '../Keys';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

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
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpData.password || signUpData.password.trim() === '') {
      setError('Please enter a password.');
      return;
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${BaseURL}/signUp`, {
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

      document.cookie = `userDetails=${JSON.stringify(user)}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;
      document.cookie = `jwtToken=${data.jwt}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;

      handletoken(data.jwt);
      setError(''); // Clear error state after successful signup
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Signup failed. Please try again.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.password || loginData.password.trim() === '') {
      setError('Please enter a password.');
      return;
    }
    try {
      const response = await fetch(`${BaseURL}/authenticate`, {
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

      document.cookie = `userDetails=${JSON.stringify(user)}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;
      document.cookie = `jwtToken=${data.jwt}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;

      handletoken(data.jwt);
      setError(''); // Clear error state after successful login
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  useEffect(() => {
    const storedUserDetails = getCookie('userDetails');
    const storedToken = getCookie('jwtToken');

    if (storedUserDetails && storedToken) {
      console.log('User details are already available:', JSON.parse(storedUserDetails));
      success(JSON.parse(storedUserDetails));
    }
  }, [success]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-card">
      {mode === 'login' && (
        <div>
          Log in
          <form onSubmit={handleLoginSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleLoginChange} />
            <div className="password-input">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleLoginChange} />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <i class="fa fa-eye-slash"></i> : <i class="fa fa-eye"></i>} {/* Eye icon */}
                </span>
            </div>
            {error && <p className="error">{error}</p>}
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
      <div className="password-input">
        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleSignUpChange} />
        <span className="password-toggle" onClick={togglePasswordVisibility}>
          {showPassword ? <i class="fa fa-eye-slash"></i> : <i class="fa fa-eye"></i>} {/* Eye icon */}
        </span>
      </div>
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
