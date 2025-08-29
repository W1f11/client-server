import React, { useState } from 'react';
import './Register.css';
import '../../App.css';
import { Link, useNavigate } from 'react-router-dom'; 
import grass from '../../LoginAssets/grass.mp4';
import Leaf from '../../LoginAssets/Leaf.png';
import { FaUserShield } from "react-icons/fa";
import { AiOutlineSwapRight } from "react-icons/ai";
import { BsFillShieldLockFill } from "react-icons/bs";
import { MdMarkEmailRead } from "react-icons/md";
import Axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // pour afficher les erreurs

  // Fonction d'envoi
  const createUser = async (event) => {
  event.preventDefault();
  setError(""); // reset erreur
  console.log("Form submitted ✅", { email, username, password });

  try {
    const response = await Axios.post("http://localhost:3002/register", {
      email,
      username,
      password,
    });

    console.log("Backend response:", response.data);

    if (response.status === 201) {
      // ✅ Reset des champs
      setEmail("");
      setUserName("");
      setPassword("");

      // ✅ Navigation vers Login uniquement si succès
      navigate("/");
    } else {
      setError(response.data.message || "Erreur inconnue du serveur");
    }
  } catch (err) {
    console.error("Error creating user:", err);

    if (err.response && err.response.data) {
      setError(err.response.data.message || "Erreur lors de la création du compte.");
    } else {
      setError("Impossible de contacter le serveur.");
    }
  }
};



  return (
    <div className='registerPage flex'>
      <div className="container flex">

        {/* Partie gauche */}
        <div className="videoDiv">
          <video src={grass} autoPlay muted loop></video>

          <div className='videoDiv'>
            <h2 className='title'>Create And Sell Extraordinary Products</h2>
            <p>Adopt the peace of Nature!!</p>
          </div>

          <div className='footerDiv flex'>
            <span className='text'>Have an account?</span>
            <Link to={'/'}>
              <button className='btn'>Login</button>
            </Link>
          </div>
        </div> 

        {/* Partie droite : formulaire */}
        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={Leaf} alt="Logo Image" />
            <h3>Let Us Know You!!</h3>
          </div>

          <form className='form grid' onSubmit={createUser}>
            {/* Affichage des erreurs */}
            {error && <p className="error">{error}</p>}

            {/* Email */}
            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <MdMarkEmailRead className='icon'/>
                <input
                  type="email"
                  id='email'
                  placeholder='Enter email'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="inputDiv">
              <label htmlFor="username">UserName</label>
              <div className="input flex">
                <FaUserShield className='icon'/>
                <input
                  type="text"
                  id='username'
                  placeholder='Enter username'
                  onChange={(e) => setUserName(e.target.value)}
                  value={username}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <BsFillShieldLockFill className='icon'/>
                <input
                  type="password"
                  id='password'
                  placeholder='Enter Password'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </div>
            </div>

            {/* Bouton Register */}
            <button type='submit' className='btn flex'>
              <span>Register</span>
              <AiOutlineSwapRight className='icon'/>
            </button>

            <span className='forgotPassword'>
              Forgot your Password? <a href="">Click Here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
