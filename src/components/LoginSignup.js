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
    confirmPassword: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [otp, setOtp] = useState({ otp1: '', otp2: '', otp3: '', otp4: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [verifyMode, setVerifyMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  useEffect(() => {
    setError('');
    if(mode!=='forgot'){
    setForgotMode(false);
    }
    if(mode!=='sendOtp'){
      setOtpMode(false);
      }
      if(mode!=='verify'){
        setVerifyMode(false);
        }
      
    
    console.log("change mode" + mode);
  }, [mode]);

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (!signUpData.firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }

    if (!signUpData.email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!signUpData.password.trim()) {
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
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
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
      setError('');
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Signup failed. Please try again.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!loginData.password.trim()) {
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
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
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
      setError('');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUpModeChange = () => {
    setError('');
    onModeChange('signup');
  };

  const handleLoginModeChange = () => {
    setError('');
    onModeChange('login');
    setForgotMode(false); // Reset forgotMode when switching to login mode
  };

  const handleForgotMode = () => {
    setError('');
    onModeChange('forgot');
    setForgotMode(true); // Activate forgotMode
  };
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!signUpData.email.trim()) {
      setError('Please enter your email.');
    } else {
      try {
        const response = await fetch(`${BaseURL}/forgotPass`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: signUpData.email, // Use the email from signUpData
            mode: 'sendOtp', // Set the mode to 'sendOtp'
          }),
        });
  
        if (response.ok) {
          const successMessage = await response.text();
          setError('');
        onModeChange('sendOtp');
        setOtpMode(true); // Activate forgotMode
        startResendTimer();
          setSuccessMessage(successMessage);
        }
  else{
        const errorMessage = await response.text();
          setError(errorMessage);
          return;}
      } catch (error) {
        console.error('Failed to send OTP:', error);
        setError('Failed to send OTP. Please try again.');
      }
    }
  };
  
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const otpValue = Object.values(otp).join('');
    console.log('Verifying OTP:', otpValue);
    try {
      const response = await fetch(`${BaseURL}/forgotPass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signUpData.email, // Use the email from signUpData
          otp: otpValue,
          mode: 'verifyOtp', // Set the mode to 'sendOtp'
        }),
      });

      if (response.ok) {
        const successMessage = await response.text();
        setVerifyMode(true);
      onModeChange('verify');
      setError(''); // Clear any previous error messages
      setSuccessMessage(successMessage);
        }
        else{
      const errorMessage = await response.text();
      setError(errorMessage);
      return;}
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError('OTP verification failed. Please try again.');
    }
  };
  
  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    const updatedOtp = value.replace(/\D/g, '').slice(0, 1); // Ensuring only one digit is entered
    setOtp({ ...otp, [name]: updatedOtp });
    console.log(otp);
  };

  const UpdatePassword = async(e) => {
    e.preventDefault();
    if (!signUpData.password.trim()) {
      setError('Please enter a password.');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${BaseURL}/forgotPass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signUpData.email, // Use the email from signUpData
          password: signUpData.password,
          mode: 'updatePassword', // Set the mode to 'sendOtp'
        }),
      });

      if (response.ok) {
        const successMessage = await response.text();
      onModeChange('login');
      setError(''); // Clear any previous error messages
      setSuccessMessage(successMessage);
        }
        else{
      const errorMessage = await response.text();
      setError(errorMessage);
      return;}
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError('OTP verification failed. Please try again.');
    }

   console.log("passwordUpdated");
  };
  const startResendTimer = () => {
    setResendDisabled(true); // Disable the resend button
    setResendTimer(120); // Set the timer to 120 seconds (2 minutes)

    const interval = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval); // Stop the timer when it reaches 0
          setResendDisabled(false); // Enable the resend button
        }
        return prevTimer - 1; // Decrement the timer by 1 second
      });
    }, 1000); // Update the timer every second
  };

  useEffect(() => {
    if (successMessage || error) {
      // Set timeout to clear success and error messages after 5 seconds
      const timeoutId = setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 5000);
  
      // Cleanup function to clear timeout on component unmount or on mode change
      return () => clearTimeout(timeoutId);
    }
  }, [successMessage, error, mode]);
  return (
    <div className="login-card">
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      {!forgotMode && mode === 'login' && (
        <div>
          Welcome!
          <h5>Sign in to your account</h5>
          <form onSubmit={handleLoginSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleLoginChange} />
            <div className="password-input">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleLoginChange} />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
              </span>
              <div className='forgotlink'>
                <span onClick={handleForgotMode}>Forgot Password?</span>
              </div>
            </div>
            <button type="submit">Log In</button>
          </form>
          <span>New user? Click </span>
          <span className="spanforcheck" onClick={handleSignUpModeChange}>here</span>
          <span> to register yourself </span>
        </div>
      )}
      {!forgotMode && mode === 'signup' && (
        <div>
          Create Account!
          <form onSubmit={handleSignUpSubmit}>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleSignUpChange} />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleSignUpChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleSignUpChange} />
            <input type="text" name="mobile" placeholder="Mobile Number" onChange={handleSignUpChange} />
            <div className="password-input">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleSignUpChange} />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
              </span>
            </div>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleSignUpChange} />
            <button type="submit">Sign Up</button>
          </form>
          <span>Already registered? Click </span>
          <span className="spanforcheck" onClick={handleLoginModeChange}>here</span>
          <span> to login </span>
        </div>
      )}
      {forgotMode && !otpMode && (
        <div>
          Enter Your Email
          <form onSubmit={sendOtp}>
          <input type="email" name="email" placeholder="Email" onChange={handleSignUpChange} />
          <button type="submit">SendOtp</button>
          </form>
          {/* Add your forgot password logic here */}
        </div>
      )}
      {otpMode && (
  <div>
    <p>Enter OTP</p>  
    <form onSubmit={handleOtpVerification}>
      <div className="otp-input-container">
        <input type="text" maxLength="1" name="otp1" onChange={handleOtpChange} />
        <input type="text" maxLength="1" name="otp2" onChange={handleOtpChange} />
        <input type="text" maxLength="1" name="otp3" onChange={handleOtpChange} />
        <input type="text" maxLength="1" name="otp4" onChange={handleOtpChange} />
      </div>
      <button type="submit">Verify</button>
    </form>
    {resendTimer > 0 && (
            <p>Resend OTP in {resendTimer} seconds</p>
          )}
          {resendTimer === 0 && !resendDisabled && (
            <button onClick={sendOtp}>Resend OTP</button>
          )}
  </div>
)}


{verifyMode && (
        <div>
          Enter Your New Password
          <form onSubmit={UpdatePassword}>
          <div className="password-input">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleSignUpChange} />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
              </span>
            </div>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleSignUpChange} />
          <button type="submit">Updat Password</button>
          </form>
          {/* Add your forgot password logic here */}
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
