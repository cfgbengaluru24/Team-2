import React from 'react'
import './Login.css';
export default function Login() {
  const handleLogin = () => {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (email === 'admin@gmail.com' && password === 'admin') {
      // Perform login logic here
      console.log('Login successful');
      // Redirect to /dashboard
      window.location.href = '/dashboard';
    } else {
      console.log('Invalid credentials');
    }
  };

  return (
    <>
      <div className="form-box login">
        {/* <!-- <span className="icon-close"><i className="material-icons">close</i></span> --> */}
        <h2>Login</h2>
        <form action="#">
          <div className="input-box">
            <span className="icon"><i className="material-icons"></i></span>
            <input type="email" required />
            <label>Email</label>
          </div>
          <div className="input-box">
            <span className="icon"><i className="material-icons"></i></span>
            <input type="password" required />
            <label>Password</label>
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot Password?</a>
          </div>
          <button type="button" className="btn" onClick={handleLogin}>Login</button>
        </form>
      </div>
    </>
  );
}