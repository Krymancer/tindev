import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './Main.css'

import api from '../servies/api'

import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'


export default function Main({ match }){
    const [developers, setDevelopers] = useState([]);

    useEffect(() => {
        async function loadDevelopers(){
            const response = await api.get('all', {
                headers: { id: match.params.id }
            });

            setDevelopers(response.data);
        }

        loadDevelopers();
    }, [match.params.id]);

    async function handleLike(id){
        await api.post(`${id}/like`,null, {
            headers: { id: match.params.id }
        });

        setDevelopers(developers.filter(developer => developer._id !== id ));
    }

    async function handleDislike(id){
        await api.post(`${id}/dislike`,null, {
            headers: { id: match.params.id }
        });

        setDevelopers(developers.filter(developer => developer._id !== id ));
    }


    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="tindev" />
            </Link>
            { developers.length > 0 ? ( 
                <ul>
                    {developers.map(developer => (
                        <li key={developer._id}>
                            <img src={developer.avatar} alt={developer.name}/>
                            <footer>
                                <strong>{developer.name}</strong>
                                <p>{developer.bio} </p>
                            </footer>

                            <div className="buttons">
                                <button type="button" onClick={() => handleLike(developer._id)}>
                                    <img src={like} alt=""/>
                                </button>
                                <button type="button" onClick={() => handleDislike(developer._id)}>
                                    <img src={dislike} alt=""/>
                                </button>
                            </div>
                        </li>
                ))}
                    </ul>
                ) : ( <div className="empty"> Acabou :( </div> ) }
        </div>
    );
    
}