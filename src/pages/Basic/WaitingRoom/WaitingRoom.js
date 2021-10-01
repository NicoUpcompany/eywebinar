/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Menu, Spin, notification } from "antd";
import { UnorderedListOutlined, LoadingOutlined } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";
import $ from "jquery";
import jwtDecode from "jwt-decode";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import { isSafari, isMobileSafari } from "react-device-detect";
import { CometChat } from "@cometchat-pro/chat";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import ChatIcon from "@material-ui/icons/Chat";
import EventIcon from "@material-ui/icons/Event";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

import { getTime } from "../../../api/time";
import { eventApi } from "../../../api/events";
import { getAccessTokenApi } from "../../../api/auth";
import { updateWaitingRoomTimeApi } from "../../../api/user";
import { COMETCHAT_CONSTANTS } from "../../../consts";

import logo from "../../../assets/images/logo-wtng-rm.png";
import standxl from "../../../assets/images/stand-xl.png";
import stands from "../../../assets/images/stand-s.png";
import standm from "../../../assets/images/stand-m.png";
import standl from "../../../assets/images/stand-l.png";

import audio from "../../../assets/audio/audio.mp3";

import Agenda from "../../../components/Basic/Agenda/Agenda";
import Footer from "../../../components/Basic/Footer/Footer";
import { CometChatUnified } from "../../../components/CometChat";
import Socket from "../../../utils/socket";

import StandS from "../../../components/Basic/Stand/stand-S";
import StandM from "../../../components/Basic/Stand/stand-M";
import StandL from "../../../components/Basic/Stand/stand-L";
import StandXL from "../../../components/Basic/Stand/stand-XL";

import "./WaitingRoom.scss";

const CUSTOMER_MESSAGE_LISTENER_KEY = "client-listener";
const { SubMenu } = Menu;

const WaitingRoom = () => {
	const history = useHistory();
	const [url, setUrl] = useState("");
	const [id, setId] = useState("initialState");
	const [current, setCurrent] = useState("mail");
	const [loading, setLoading] = useState(false);
	const [state, setState] = useState(true);
	const [perfilState, setPerfilState] = useState(false);
	const [saveData, setSaveData] = useState(0);
	const [agendaTime, setAgendaTime] = useState(null);
	const [token2, setToken2] = useState(null);
	const [unreadMessage, setUnreadMessage] = useState(0);
	const [notifications, setNotifications] = useState(true);
	const [chat, setChat] = useState(false);
	const [state2, setState2] = useState(true);

	useEffect(() => {
		let interval;
		getTime2(interval);
		const token = getAccessTokenApi();
		if (token === null) {
			history.push("/iniciarsesion");
		} else {
			if (!isMobileSafari && isSafari) {
				setState2(false);
			}
			const decodedToken = jwtDecode(token);
			if (!decodedToken) {
				history.push("/iniciarsesion");
			} else {
				setToken2(token);
				const user = {
					id: decodedToken.id,
					route: window.location.pathname,
				};
				Socket.emit("UPDATE_ROUTE", user);
				if (decodedToken.id === "6030020f11dc556d0599d445") {
					setPerfilState(true);
				}
				const data = {
					email: decodedToken.email,
				};
				updateWaitingRoomTimeApi(token, data);
				const UID = decodedToken.id;
				const apiKey = COMETCHAT_CONSTANTS.AUTH_KEY;
				const GUID = "chat_general";
				const password = "";
				const groupType = CometChat.GROUP_TYPE.PUBLIC;
				CometChat.login(UID, apiKey).then(
					(User) => {
						CometChat.joinGroup(GUID, groupType, password).then(
							(group) => {},
							(error) => {}
						);
					},
					(error) => {}
				);
			}
		}
	}, []);

	useEffect(() => {
		let interval;
		getTime2(interval);
	}, [chat]);

	useEffect(() => {
		let action = "pageView";
		let description = "";
		switch (saveData) {
			case 1:
				action = "Menu";
				description = "Visitar mi Perfil";
				break;
			case 2:
				action = "Footer";
				description = "Powered By Up";
				break;
			case 3:
				action = "Agenda";
				description = "Entrar al Salón";
				break;
			case 4:
				action = "Cronometro";
				description = "Streaming";
				break;
			default:
				break;
		}
		const data = {
			conectionType: window.conectionType,
			page: "/salaespera",
			action,
			description,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		if (saveData === 1) {
			history.push("/perfil");
		}
		if (saveData === 2) {
			window.open("https://www.upwebinar.cl/", "_blank");
		}
		if (saveData === 3 || saveData === 4) {
			history.push("/streaming");
		}
	}, [saveData]);

	useEffect(() => {
		if (!isSafari && !isMobileSafari) {
			if (notifications) {
				CometChat.addMessageListener(
					CUSTOMER_MESSAGE_LISTENER_KEY,
					new CometChat.MessageListener({
						onTextMessageReceived: (textMessage) => {
							const newAudio = new Audio(audio);
							newAudio.play();
							let message = textMessage.data.text;
							if (message.length > 25) {
								message = message.substring(0, 25) + "...";
							}
							notification["info"]({
								message: "Nuevo mensaje",
								description: message,
							});
						},
					})
				);
			} else {
				CometChat.removeMessageListener(CUSTOMER_MESSAGE_LISTENER_KEY);
			}
		}
	}, [notifications]);

	const handleClick = (e) => {
		setCurrent({ current: e.key });
	};

	const OnOffNotifications = () => {
		let action;
		if (notification) {
			action = "Silenciar notificaciones";
		} else {
			action = "Activar notificaciones";
		}
		const data = {
			conexionType: window.conectionType,
			page: "/salaespera",
			action,
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		setNotifications(!notifications);
	};

	const changeChatStatus = () => {
		let action;
		if (chat) {
			action = "Cerrar Chat";
		} else {
			action = "Abrir Chat";
		}
		const data = {
			conexionType: window.conectionType,
			page: "/salaespera",
			action,
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		setChat(!chat);
	};

	const getTime2 = async (interval) => {
		setLoading(true);
		try {
			const resp = await getTime();
			const timeApi = moment(resp.time).valueOf();
			setAgendaTime(resp.time);
			$(".cronometro").each(function () {
				const $this = $(this);
				let now = timeApi;

				interval = setInterval(function () {
					const countDownDate = moment(resp.eventTime).valueOf();
					const distance = countDownDate - now;
					const days_t = Math.floor(distance / (1000 * 60 * 60 * 24));
					const hours_t = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					const minutes_t = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					const seconds_t = Math.floor((distance % (1000 * 60)) / 1000);
					let days, m1, m2, hours, minutes, seconds;
					if (days_t < 10) {
						days = "0" + days_t;
					} else {
						m1 = String(days_t).substring(0, 1);
						m2 = String(days_t).substring(1, 2);
						days = m1 + m2;
					}
					if (hours_t < 10) {
						hours = "0" + hours_t;
					} else {
						m1 = String(hours_t).substring(0, 1);
						m2 = String(hours_t).substring(1, 2);
						hours = m1 + m2;
					}
					if (minutes_t < 10) {
						minutes = "0" + minutes_t;
					} else {
						m1 = String(minutes_t).substring(0, 1);
						m2 = String(minutes_t).substring(1, 2);
						minutes = m1 + m2;
					}
					if (seconds_t < 10) {
						seconds = "0" + seconds_t;
					} else {
						m1 = String(seconds_t).substring(0, 1);
						m2 = String(seconds_t).substring(1, 2);
						seconds = m1 + m2;
					}
					$this.empty();
					if (countDownDate > now) {
						$this.append("<div><h1>" + days + "</h1><span>Días</span></div>");
						$this.append("<div><h1>" + hours + "</h1><span>Horas</span></div>");
						$this.append("<div><h1>" + minutes + "</h1><span>Minutos</span></div>");
						$this.append("<div><h1>" + seconds + "</h1><span>Segundos</span></div>");
						setLoading(false);
					} else {
						setState(false);
						setLoading(false);
						clearInterval(interval);
					}
					now = moment(now).add(1, "seconds").valueOf();
				}, 1000);
			});
			setLoading(false);
		} catch (exception) {
			setLoading(false);
			console.log(exception);
		}
	};

	const handleClickAbrir = (id, url) => {
		const data = {
			conexionType: window.conectionType,
			page: "/salaespera",
			action: "Stand",
			description: `${id} - Abrir Stand`,
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		const doc = document.getElementById(id);
		const doc2 = document.getElementById("fondoStand");
		doc2.style.left = "0px";
		doc.style.right = "0px";
		doc.style.transitionDuration = "1s";
		doc2.style.transitionDuration = "1s";
		const bodi = document.getElementsByTagName("body");
		bodi[0].classList.add("stop");
		setUrl(url);
		setId(id);
	};

	const antIcon = <LoadingOutlined spin />;

	return (
		<Spin spinning={loading} size="large" tip="Cargando..." indicator={antIcon}>
			{chat ? (
				<>
					<CometChatUnified />
					<div className="pregunta2">
						<div className="card">
							<div className="barra fadeInUpBig">
								<h3 onClick={() => changeChatStatus()}>NETWORKING</h3>
								<div className="message">
									<div className="message-container">
										<Tooltip title="Cerrar networking" placement="top">
											<ChatIcon className="mensaje" onClick={() => changeChatStatus()} />
										</Tooltip>
									</div>
									{unreadMessage > 0 ? <span className="noti">{unreadMessage}</span> : null}
									{notifications ? (
										<div onClick={OnOffNotifications} className="volumen">
											<Tooltip title="Silenciar Notificaciones" placement="top">
												<VolumeUpIcon className="icon" />
											</Tooltip>
										</div>
									) : (
										<div onClick={OnOffNotifications} className="volumen">
											<Tooltip title="Habilitar Notificaciones" placement="top">
												<VolumeOffIcon className="icon" />
											</Tooltip>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="fondo">
						<div className="menu">
							<div className="logo">
								<img src={logo} alt="logo" width="180" />
							</div>
							<div className="subMenu desktop">
								<Link href="/salaespera">Sala de espera</Link>
								<a href="#agenda">Agenda</a>
								{state2 ? <Link onClick={() => changeChatStatus()}>Networking</Link> : null}
								<a href="#stands">Stands</a>
								<Link to="/streaming" className="perfil">
									Streaming
								</Link>
							</div>
							<div className="movil">
								<Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
									<SubMenu key="SubMenu" icon={<UnorderedListOutlined />} title="">
										<Menu.Item key="setting:1">
											<Link className="opcion" to="/salaespera">
												Sala de espera
											</Link>
										</Menu.Item>
										<Menu.Item key="setting:2">
											<Link className="opcion" to="#agenda">
												Agenda
											</Link>
										</Menu.Item>
										{state2 ? (
											<Menu.Item key="setting:3">
												<Link className="opcion" onClick={() => changeChatStatus()}>
													Networking
												</Link>
											</Menu.Item>
										) : null}
										<Menu.Item key="setting:4">
											<Link className="opcion" to="#stands">
												stands
											</Link>
										</Menu.Item>
										<Menu.Item key="setting:5">
											<Link className="opcion" to="/streaming">
												Streaming
											</Link>
										</Menu.Item>
									</SubMenu>
								</Menu>
							</div>
						</div>
						<div className="header2">
							<>
								{state ? (
									<div className="centrado">
										<div className="cronometro"></div>
									</div>
								) : (
									<div className="centrado">
										<div className="btn">
											<button onClick={() => setSaveData(4)}>Streaming</button>
										</div>
									</div>
								)}
							</>
						</div>
						{state2 ? (
							<div className="pregunta2">
								<div className="card">
									<div className="barra fadeInUpBig">
										<h3 onClick={() => changeChatStatus()}>Networking</h3>
										<div className="message">
											<div className="message-container">
												<Tooltip title="Ingresar a networking" placement="top">
													<ChatIcon className="mensaje" onClick={() => changeChatStatus()} />
												</Tooltip>
											</div>
											{unreadMessage > 0 ? <span className="noti">{unreadMessage}</span> : null}
											{notifications ? (
												<div onClick={OnOffNotifications} className="volumen">
													<Tooltip title="Silenciar Notificaciones" placement="top">
														<VolumeUpIcon className="icon" />
													</Tooltip>
												</div>
											) : (
												<div onClick={OnOffNotifications} className="volumen">
													<Tooltip title="Habilitar Notificaciones" placement="top">
														<VolumeOffIcon className="icon" />
													</Tooltip>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						) : null}
						<div className="async">
							<div className="async-container">
								<div className="data">
									<h1 className="async-title">Streaming Asincrónico</h1>
									<p className="async-description">
										Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
										magna aliqua. Ut enim ad minim veniam.
									</p>
									<div className="icons-container">
										<p className="date">
											<EventIcon className="icon" />
											<span>Miér. 14 de Octubre</span>
										</p>
										<p className="date">
											<AccessTimeIcon className="icon" />
											<span>09:00</span>
										</p>
									</div>
									<Link to="/asincrono" className="async-button">
										Ver Aquí
									</Link>
								</div>
							</div>
						</div>
						<Agenda agendaTime={agendaTime} state={state} setSaveData={setSaveData} />
						<div className="contenedor" id="stands">
							<h1 className="title">Stands</h1>
							<div className="stands">
								<div className="col-2">
									<img
										src={standxl}
										alt="stand xl"
										onClick={() => handleClickAbrir("stand-xl", "https://player.vimeo.com/video/461210981")}
									/>
								</div>
								<div className="col-4">
									<div className="col-2">
										<img
											src={stands}
											alt="stand s"
											onClick={() => handleClickAbrir("stand-s", "https://player.vimeo.com/video/461210981")}
										/>
									</div>
									<div className="col-2">
										<img
											src={stands}
											alt="stand s"
											onClick={() => handleClickAbrir("stand-s", "https://player.vimeo.com/video/461210981")}
										/>
									</div>
									<div className="col-2">
										<img
											src={stands}
											alt="stand s"
											onClick={() => handleClickAbrir("stand-s", "https://player.vimeo.com/video/461210981")}
										/>
									</div>
									<div className="col-2">
										<img
											src={stands}
											alt="stand s"
											onClick={() => handleClickAbrir("stand-s", "https://player.vimeo.com/video/461210981")}
										/>
									</div>
								</div>
							</div>
							<div className="stands">
								<div className="col-2">
									<img
										src={standm}
										alt="stand m"
										onClick={() => handleClickAbrir("stand-m", "https://player.vimeo.com/video/461210981")}
									/>
								</div>
								<div className="col-2">
									<img
										src={standm}
										alt="stand m"
										onClick={() => handleClickAbrir("stand-m", "https://player.vimeo.com/video/461210981")}
									/>
								</div>
							</div>
							<div className="stands">
								<div className="col-3">
									<img
										src={standl}
										alt="stand l"
										onClick={() => handleClickAbrir("stand-l", "https://player.vimeo.com/video/461210981")}
									/>
								</div>
								<div className="col-3">
									<img
										src={standl}
										alt="stand l"
										onClick={() => handleClickAbrir("stand-l", "https://player.vimeo.com/video/461210981")}
									/>
								</div>
								<div className="col-3">
									<img
										src={standl}
										alt="stand l"
										onClick={() => handleClickAbrir("stand-l", "https://player.vimeo.com/video/461210981")}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="fondoStand" id="fondoStand">
						<StandS setUrl={setUrl} url={url} token={token2} id={id} />
						<StandM setUrl={setUrl} url={url} token={token2} id={id} />
						<StandL setUrl={setUrl} url={url} token={token2} id={id} />
						<StandXL setUrl={setUrl} url={url} token={token2} id={id} />
					</div>
					<Footer setSaveData={setSaveData} />
				</>
			)}
		</Spin>
	);
};

export default WaitingRoom;
