import React from 'react';
import './Auth.css';

function Login() {
  return (
    <div className="auth">
      <h2>Sign In</h2>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;
