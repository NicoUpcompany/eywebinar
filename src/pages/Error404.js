import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { getAccessTokenApi } from '../api/auth';
import Socket from '../utils/socket';

import './Error404.scss';

export default function Error404() {

    useEffect(() => {
		const token = getAccessTokenApi();
		if (token !== null) {
			const decodedToken = jwtDecode(token);
			if (decodedToken) {
				const user = {
					id: decodedToken.id,
					route: window.location.pathname
				}
				Socket.emit('UPDATE_ROUTE', user);
			} 
		}
    }, []);
    
    return (
        <div className="error">
            <div id='oopss'>
                <div id='error-text'>
                    <span>404</span>
                    <p>PÁGINA NO ENCONTRADA</p>
                    <p className='hmpg'><Link to='/' className="back">Volver al inicio</Link></p>
                </div>
            </div>
        </div>
    )
}