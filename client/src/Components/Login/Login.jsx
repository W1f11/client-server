import React from 'react'
import './Login.css'
import '../../App.css'
import grass from '../../LoginAssets/grass.mp4'
import Leaf from '../../LoginAssets/Leaf.png'
import { Link } from 'react-router-dom'
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";

const Login = () => {
  return (
    <div className='loginPage flex'>
      <div className='container flex'>
        
        {/* Partie gauche : vidéo + texte */}
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

        {/* Partie droite : formulaire */}
        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Leaf} alt="Logo Image" />
            <h3>Welcome Back!!</h3>
          </div>

          {/* 👉 Ici tu pourras mettre ton <form> plus tard */}
          <form className='form grid' >
            <span ></span>

            <div className="inputDiv">
              <label htmlFor="username">UserName</label>
              <div className="input flex">
                <FaUserShield className='icon' />
                <input
                  type="text"
                  id='username'

                  placeholder='Enter username'
                />
              </div>
            </div>
            <div className="inputDiv">
                <label htmlFor="password">Password</label>
                 <div className="input flex">
                  <BsFillShieldLockFill className='icon'/>
                   <input type="password" id='password'  placeholder='Enter Password'  />
                    </div>
             </div>
             <button type='submit' className='btn flex'>
                            <span>Login</span>
                            <AiOutlineSwapRight className='icon'/>
                        </button>
                        
                        <a href="/dashboard">Dashboard</a>

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
