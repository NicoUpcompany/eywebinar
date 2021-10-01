/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Spin, ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import jwtDecode from 'jwt-decode';
import { useHistory } from "react-router-dom";

import Socket from '../../../utils/socket';
import { getAccessTokenApi } from '../../../api/auth';

import './Options.scss';

export default function Events() {

    const history = useHistory();
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            setLoading(true);
            let interval;
            const token = getAccessTokenApi();
            if (token === null) {
                history.push("/dashboard/iniciarsesion");
            } else {
                const decodedToken = jwtDecode(token);
                if (decodedToken.role !== 'Admin') {
                    history.push("/dashboard/iniciarsesion");
                } else {
                    const user = {
                        id: decodedToken.id,
                        route: window.location.pathname
                    }
                    Socket.emit('UPDATE_ROUTE', user);
                    interval = setInterval(() => {
                    }, 5000);
                }
            }
            return () => clearInterval(interval);
        } catch (error) {
            history.push("/dashboard/iniciarsesion");
        }
    }, []);

    return (
        <ConfigProvider locale={es_ES}>
            <Spin spinning={loading} size="large" tip="Cargando...">
                
            </Spin>
        </ConfigProvider>
    )
}