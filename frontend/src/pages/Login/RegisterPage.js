import React, { useState } from 'react';
import httpClient from "../../httpClient";
import '../../assets/login.css';

const RegisterPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await httpClient.post('http://localhost:5000/register', {
            username: username,
            password: password
        })
        .then(function(response){
            console.log(response);
            window.location.href="/login";
        })
        .catch(function(error){
            console.log(error);
        });

    };

  return (
    <div class="container">

        <h3>SIGN UP</h3>

        <form onSubmit={handleSubmit}>

            <label>
                Username:
                <input 
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>

            <label>
                Password:
                <input 
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>

            <input type="submit" />

        </form>
    </div>
  )
}

export default RegisterPage;