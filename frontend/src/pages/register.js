import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import httpClient from "../httpClient";
import '../assets/login.css';

const RegisterPage = () => {

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await httpClient.post('http://localhost:5000/register', {
            username: username,
            email: email,
            password: password
        })
        .then(function(response){
            console.log(response);
            window.location.href="/login";
        })
        .catch(function(error){
            if(error.response.status === 409){
                setErrorMessage("Username/email already exists");
            }
        })
    }

    useEffect(() => {
        document.title = "Register"

        httpClient.get("http://localhost:5000/@me")
        .then(function(response){
            navigate("/")
        })
        .catch(function(error){
            console.log(error)
        })
    })

  return (
    <div className="register">
        <div className="register-container">
            <form onSubmit={handleSubmit}>

                <h3>Sign up</h3>
                <input 
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input 
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input 
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {errorMessage !== "" ? <span className="error">{errorMessage}</span> : <div />}

                <button type="submit">Sign up</button>

                <p className="pLink">Already have an account? <Link to="/login" className="link">Sign in</Link></p>

            </form>
        </div>
    </div>
  )
}

export default RegisterPage;