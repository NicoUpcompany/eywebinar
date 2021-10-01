/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Menu, notification, Spin } from 'antd';
import { UnorderedListOutlined, LoadingOutlined } from '@ant-design/icons';
import jwtDecode from 'jwt-decode';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { useHistory } from "react-router-dom";
// import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import Footer from '../../../components/Basic/Footer/Footer';
import logo from '../../../assets/img/logo.png';
import { getAccessTokenApi } from '../../../api/auth';
import {AgendarOwner,EstadoAgenda} from '../../../api/agenda';
import { eventApi } from '../../../api/events';
import Socket from '../../../utils/socket';

import './Perfil.scss'

const { SubMenu } = Menu;

const Perfil = () => {

    const history = useHistory();

    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState("mail");
    const [dia, setDia] = useState(24);
    const [contador, setContador] = useState(0);
    const [array, setArray] = useState([]);
    const [saveData, setSaveData] = useState(0);
    // const [mensaje2, setMensaje2] = useState('');

    useEffect(() => {
		setLoading(true);
		const token = getAccessTokenApi();
		if (token === null) {
			history.push("/iniciarsesion");
		} else {
			const decodedToken = jwtDecode(token);
			if (!decodedToken) {
                history.push("/iniciarsesion");
			} else {
                setToken(token);
                const user = {
					id: decodedToken.id,
					route: window.location.pathname
				}
                Socket.emit('UPDATE_ROUTE', user);
		        setLoading(false);

			}
		}
    }, []);
    
    useEffect(() => {
        setLoading(true);
        const interval = setInterval(() => {
            getAgenda();
        }, 5000);
        return () => clearInterval(interval);
    }, [dia]);

    useEffect(() => {
        let action = 'pageView';
		let description = '';
        switch (saveData) {
            case 1:
                action = 'Menu';
                description = 'Sala de Espera';
                break;
            case 2:
                action = 'Footer';
                description = 'Powered By Up';
                break;
            default:
                break;
        }
        const data = {
            conectionType: window.conectionType,
            page: '/perfil',
            action,
            description,
            userId: localStorage.getItem('userID'),
        }
        eventApi(data);
        if (saveData === 1) {
            history.push('/salaespera')
        }
        if (saveData === 2) {
           window.open('https://upwebinar.cl/');
        }
    }, [saveData]);

    const handleClick = e => {
        setCurrent({ current: e.key });
    };
    
    const getAgenda = async () => {
		const token = getAccessTokenApi();
        const decodedToken = jwtDecode(token);
        const data = {
            userId: decodedToken.id,
            day:dia
        }
        const result = await AgendarOwner(data,token);
        if(result.ok){
            const arreglo = result.agenda;
            contarAgendas(arreglo);
            llenarArreglo(arreglo);
        }
        setLoading(false);
    }

    const llenarArreglo = (array2) => {
        setArray(array2);
    }

    const contarAgendas = (agenda) => {
        agenda.forEach(element => {
            if(element.user){
                setContador(contador + 1);
            }
        });
    }
    const rechazar = async (id,dia2) => {
        setLoading(true);
        const result = await EstadoAgenda(token,id);
        if(!result.ok){
            notification['error']({
                message: result.message
            });
            setLoading(false);
            
        }else{
            setLoading(false);
            notification['success']({
                message: result.message
            });
            setDia(dia2+2);
            setDia(dia2);
            // setMensaje2(result.message);
        }
    }

    const addDay = () => {
        if (dia === 24) {
            setDia(25);
        }
        if (dia === 25) {
            setDia(26);
        }
    }

    const lessDay = () => {
        if (dia === 26) {
            setDia(25);
        }
        if (dia === 25) {
            setDia(24);
        }
    }

    const antIcon = <LoadingOutlined spin />;

    return ( 
        <>
            <Spin spinning={loading} size="large" tip="Cargando..." indicator={antIcon}>
                <div className="fondo2" style={{background:'white'}}>
                    <div className="header2">
                        <div className="logo">
                            <img src={logo} alt="logo" width="180" />
                        </div>
                        <div className="menu desktop" style={{width:'50%'}}>
                            <a onClick={() => setSaveData(1)}>SALA DE ESPERA</a>
                            {/* <a onClick={() => changeChatStatus()}>NETWORKING</a> */}
                            {/* <a>STANDS</a> */}
                            {/* <a href="/streaming#agenda">AGENDA</a> */}
                            {/* <a onClick={() => setSaveData(4)} className="perfil">VISITAR MI PERFIL</a>
                            <a onClick={() => setSaveData(5)} className="btn">STREAMING</a> */}
                        </div>
                        <div className="movil">
                            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                                <SubMenu key="SubMenu" icon={<UnorderedListOutlined  />} title="">
                                    <Menu.Item key="setting:1"><a onClick={() => setSaveData(1)}>SALA DE ESPERA</a></Menu.Item>
                                    {/* <Menu.Item key="setting:2"><a>NETWORKING</a></Menu.Item>    */}
                                    {/* <Menu.Item key="setting:3"><a>STANDS</a></Menu.Item> */}
                                    {/* <Menu.Item key="setting:4"><a>AGENDA</a></Menu.Item> */}
                                    {/* <Menu.Item key="setting:5"><a className="visit">VISITAR MI PERFIL</a></Menu.Item>
                                    <Menu.Item key="setting:6"><a className="btnStreaming">STREAMING</a></Menu.Item> */}
                                </SubMenu>
                            </Menu>
                        </div>
                    </div>
                    <div className="perfil2">
                        <div className="calendario">
                            <div className="card">
                                <div className="letras">
                                    <h2>Calendario</h2>
                                    <h1>Miércoles {dia} de Marzo</h1>
                                </div>
                                
                                <div className="flechas">
                                    <ArrowBackIosIcon className="icono" onClick={() => lessDay()} />
                                    <ArrowForwardIosIcon className="icono" onClick={() => addDay()} />
                                </div>
                                <div className="horas">
                                    {array.length > 1
                                        ?
                                            array.map((item,i) => {
                                                return (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        className="button"
                                                        startIcon={<ScheduleIcon />}
                                                        
                                                    >
                                                        {item.hour}
                                                        <Checkbox
                                                            checked={item.active}
                                                            color="primary"
                                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                            onClick={() => rechazar(item._id,dia)}
                                                        />
                                                    </Button>
                                                )
                                            })
                                        :
                                            null
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="horasTomadas">
                            <div className="pedidas">
                             {contador>0
                                ?
                                    array.length > 1
                                        ? 
                                            array.map((item,i) => {
                                                return (
                                                    item.user
                                                        ?
                                                            <div className="col">
                                                                <strong>{item.user.name} {item.user.lastname} - {item.user.position} - {item.user.enterprise}</strong>
                                                                <p>Agendado : {item.day}/03/2021  {item.hour.toString().trim()}</p>
                                                                <p>Descripción : {item.description}</p>
                                                                <p><a href={item.link} rel="noopener noreferrer" target="_blank">{item.link}</a> </p>
                                                                <div className="botones">
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        className="button"
                                                                        onClick={() => rechazar(item._id,dia)}
                                                                    >
                                                                        Rechazar
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        :
                                                            null
                                                )
                                            })
                                        : 
                                        null
                                :
                                    <p style={{width:'100%',textAlign:'center'}}>Aún no se han agendado horas</p>
                            }
                            </div>
                        </div>
                    </div>
                    <Footer 
                        setSaveData={setSaveData}
                    />
                </div>
            </Spin>
        </> 
    );
}
 
export default Perfil;