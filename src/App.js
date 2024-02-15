// App.js
import React, { useState, useEffect } from "react";
import NavBar from "../src/components/NavBar";
import LoginSignup from "../src/components/LoginSignup";
import DashBoard from "../src/components/DashBoard";
import SideNavBar from "../src/components/SideNavBar";
import PublicDashboard from "../src/components/PublicDashBoard";
import QueryPortal from "../src/components/queryPortal/QueryPortal";
import Weather from "./components/Weather";
import InterestingFactComponent from "./components/InterestingFactComponent";
const App = () => {
  const [showCard, setShowCard] = useState(false);
  const [auth, setAuth] = useState(false);
  const [loginMode, setLoginMode] = useState("login");
  const [cardMode, setCardMode] = useState("login");
  const [showSideNav, setShowSideNav] = useState(false);
  const [sideNavWidth, setSideNavWidth] = useState("0");
  const [feature, setFeature] = useState("");
  const [token, setToken] = useState("");
  const [WeatherData, setWeatherData] = useState({
    cityName: "",
    temp: "",
    weatherLooks: "",
    icon: "",
  });
  const [userData, setUserData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const handleWeatherData = (data) => {
    if (data) {
      setWeatherData(data);
    } else {
      setWeatherData({ cityName: "", temp: "", weatherLooks: "" });
    }
  };

  const toggleSideNav = () => {
    const newWidth = showSideNav ? "0" : "250px";
    setSideNavWidth(newWidth);
    setShowSideNav(!showSideNav);
    // Reset inactivity timer on user interaction
    resetActivity();
  };

  const handleLoginClick = () => {
    setShowCard(true);
    console.log("changig mode to login");
    setCardMode("login");
    // Reset inactivity timer on user interaction
    resetActivity();
  };

  const handleSignupClick = () => {
    setShowCard(true);
    setCardMode("signup");
    // Reset inactivity timer on user interaction
    resetActivity();
  };

  const handleModeChange = (newMode) => {
    setCardMode(newMode);
  };

  const handleClose = () => {
    setShowCard(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Handle logout logic
    handleAuth(null);
    // Expire cookies immediately on logout
    expireCookies();
  };

  const handleFeature = (newFeature) => {
    console.log("feature:", newFeature);
    setFeature(newFeature);
  };

  const handleToken = (newToken) => {
    console.log("setting token", newToken);
    setToken(newToken);
    // Reset inactivity timer on token update
    resetActivity();
  };

  const handleAuth = (userDetails) => {
    if (userDetails) {
      console.log("Logged in with details:", userDetails);
      setAuth(true);
      setUserData(userDetails);
      setLoginMode("logout");
    } else {
      console.log("Logged out");
      setAuth(false);
      setUserData({ firstName: "", lastName: "", email: "", mobile: "" });
      setLoginMode("login");
    }
  };

  useEffect(() => {
    // Check if the user is already logged in (by checking cookies)
    const storedUserDetails = getCookie("userDetails");
    const storedToken = getCookie("jwtToken");

    if (storedUserDetails && storedToken) {
      console.log("User details are already available:", JSON.parse(storedUserDetails));
      // Optionally, you might want to fetch additional user details using the stored user information

      // Set user details directly in the handleAuth function
      handleAuth(JSON.parse(storedUserDetails));

      // Pass the token to the LoginSignup component
      handleToken(storedToken);
    }
  }, []);

  // Activity tracker function
  let inactivityTimeout;

  const resetActivity = () => {
    clearTimeout(inactivityTimeout);

    // Set a new timeout after 10 minutes of inactivity
    inactivityTimeout = setTimeout(() => {
      // Expire the cookies after 10 minutes of inactivity
      expireCookies();
    }, 10 * 60 * 1000); // 10 minutes
  };

  const expireCookies = () => {
    document.cookie = "userDetails=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  };

  return (
    <div>
      <NavBar
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        logOut={handleLogout}
        mode={loginMode}
        toggleSideNav={toggleSideNav}
        WeatherData={WeatherData}
      />
      <React.Fragment></React.Fragment>
      {showSideNav && (
        <SideNavBar
          user={userData}
          onClose={toggleSideNav}
          style={{ width: sideNavWidth }}
          handleFeatureSelect={handleFeature}
        />
      )}
      {showCard && (
        <LoginSignup
          mode={cardMode}
          onModeChange={handleModeChange}
          onClose={handleClose}
          success={handleAuth}
          handletoken={handleToken}
        />
      )}
      {auth ? (
        <DashBoard userData={userData} />
      ) : !showCard && (
        <div className="container">

          <PublicDashboard onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
          <Weather Weather={handleWeatherData} />
        </div>
      )}
      {(feature === "queryPortal" && auth) && <QueryPortal user={userData} tokenValue={token} />}
     
      {(feature === "weather" && auth) && <Weather Weather={handleWeatherData} user={userData} tokenValue={token} />}
      {(feature === "interstingFact" && auth) && <InterestingFactComponent/>}
    </div>
  );
};

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

export default App;
