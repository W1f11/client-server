import React, { useState } from 'react'
import './Login.css'
import '../../App.css'
import grass from '../../LoginAssets/grass.mp4'
import Leaf from '../../LoginAssets/Leaf.png'
import { Link, useNavigate } from 'react-router-dom'
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur login");

      // Stocker le token
      localStorage.setItem("token", data.token);

      // Redirection vers dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='loginPage flex'>
      <div className='container flex'>

        {/* Partie gauche */}
        <div className='videoDiv'>
          <video src={grass} autoPlay loop muted></video>
          <h2 className='title'>Create And Sell Extraordinary Products</h2>
          <p>Adopt the peace of Nature!!</p>
          <div className='footerDiv flex'>
            <span className='text'>Don't have an account?</span>
            <Link to="/register">
              <button className='btn'>Sign Up</button>
            </Link>
          </div>
        </div>

        {/* Partie droite */}
        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Leaf} alt="Logo Image" />
            <h3>Welcome Back!!</h3>
          </div>

          <form className='form grid' onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <FaUserShield className='icon' />
                <input
                  type="email"
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  required
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <BsFillShieldLockFill className='icon'/>
                <input
                  type="password"
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter Password'
                  required
                />
              </div>
            </div>

            <button type='submit' className='btn flex'>
              <span>Login</span>
              <AiOutlineSwapRight className='icon'/>
            </button>

            <span className='forgotPassword'>
              Forgot your Password? <a href="">Click Here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
