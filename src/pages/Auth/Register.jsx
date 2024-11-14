import React, { useState } from 'react';
import './Auth.css';

const Register = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="regiscontainer">
      {/* Navigation */}
      {/* Main Content */}
      <main className="main-content">
        <div className="content-grid">
          {/* Left side - Images */}
          <div className="images-grid">
            <div className="images-column">
              <div className="image-wrapper trapezoid-right">
                <img 
                  src="/Pic/reg1.png" 
                  alt="Fashion model in brown sweater" 
                  width="400" 
                  height="500"
                />
              </div>
              <div className="image-wrapper trapezoid-left">
                <img 
                  src="/Pic/reg2.png" 
                  alt="Fashion model in brown sweater" 
                  width="400" 
                  height="300"
                />
              </div>
            </div>
            <div className="images-column offset">
              <div className="image-wrapper trapezoid-right">
                <img 
                  src="/Pic/reg3.png" 
                  alt="Fashion model in brown sweater" 
                  width="400" 
                  height="300"
                />
              </div>
              <div className="image-wrapper trapezoid-left">
                <img 
                  src="/Pic/reg1.png" 
                  alt="Fashion model in brown sweater" 
                  width="400" 
                  height="500"
                />
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="register-form">
            <h1>Create an account</h1>
            <p className="subtitle">Enter your details below</p>
            
            <form>
              <div className="form-field">
                <input type="text" placeholder="Name" />
              </div>
              <div className="form-field">
                <input type="email" placeholder="Email or Phone Number" />
              </div>
              <div className="form-field">
                <input type="password" placeholder="Password" />
              </div>
              
              <button type="submit" className="submit-button">
                Create Account
              </button>
              
              <div className="login-link">
                <span>Already have an account? </span>
                <a href="#">Log In</a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
