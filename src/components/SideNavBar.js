import React from 'react';
import '../css/SideBar.css'; // Ensure this CSS file exists and contains necessary styles

const SideNavBar = ({ user, onClose, handleFeatureSelect, tokenValue }) => {
  return (
    <div className="side-nav-bar">
      <a className="close-btn" onClick={onClose}>
        &times;
      </a>
      <div className="user-profile">
        <div className="user-icon">
          {/* Add user icon or avatar here */}
          <i className="fa fa-user-circle-o" aria-hidden="true"></i>
        </div>
        <div className="user-name">{user?.firstName + ' ' + user?.lastName}</div>
      </div>
      <div className='sideBarAction'>
      <a onClick={() => handleFeatureSelect('queryPortal')}>Query Portal</a>
      <a onClick={() => handleFeatureSelect('weather')}>Weather</a>
      <a onClick={() => handleFeatureSelect('interstingFact')}>Intersting Fact</a>
      <a onClick={() => handleFeatureSelect('settings')}>Settings</a>
      <a onClick={() => handleFeatureSelect('help')}>Help</a>
      {/* Add more buttons or links as needed */}
    </div>
    </div>
  );
};

export default SideNavBar;
