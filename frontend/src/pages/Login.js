import React, { useState } from 'react'
import './Login.css'

import api from '../servies/api'

import logo from '../assets/logo.svg'

export default function Login({ history }){
    const [username, setUsername] = useState('');
    
    async function handleSubmit(event){
        event.preventDefault();

        const response = await api.post('/add',{
            username
        });

        const id = response.data._id;
        
        history.push(`/developers/${id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} >
                <img src={logo} alt="tindev"/>
                <input 
                    placeholder="Digite seu usuário do Github"
                    value={username}
                    onChange={event => setUsername(event.target.value) }
                />
                <button type="submit" > Enviar </button>
            </form>
        </div>
    );
}