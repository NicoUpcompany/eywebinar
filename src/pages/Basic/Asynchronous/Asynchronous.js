/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Row, Col, Radio, Space, Input, Divider, Menu } from "antd";
import { ArrowLeftOutlined, SendOutlined, UnorderedListOutlined } from "@ant-design/icons";
import $ from "jquery";
import { Link, useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { isMobile } from "react-device-detect";

import { eventApi } from "../../../api/events";
import { getAccessTokenApi } from "../../../api/auth";
import { updateStreamTimeApi } from "../../../api/user";
import Socket from "../../../utils/socket";

import Footer from "../../../components/Basic/Footer/Footer";

import logo from "../../../assets/images/logo-wtng-rm.png";

import "./Asynchronous.scss";

const { SubMenu } = Menu;

const Streaming = () => {
	const history = useHistory();

	const [user, setUser] = useState();
	const [token, setToken] = useState(null);
	const [saveData, setSaveData] = useState(0);
	const [radioValue, setRadioValue] = useState(1);
	const [testValue, setTestValue] = useState(1);
	const [testValue2, setTestValue2] = useState(1);
	const [testValue3, setTestValue3] = useState(1);
	const [current, setCurrent] = useState("mail");

	useEffect(() => {
		if (!isMobile) {
			$(window).scroll(function () {
				const distanceY = window.pageYOffset || document.documentElement.scrollTop;
				const shrinkOn = 550;
				if (distanceY > shrinkOn) {
					$(".transmission").addClass("scroll");
				} else {
					$(".transmission").removeClass("scroll");
				}
			});
		}
		const auxToken = getAccessTokenApi();
		if (auxToken === null) {
			history.push("/iniciarsesion");
		} else {
			const decodedToken = jwtDecode(auxToken);
			if (!decodedToken) {
				history.push("/iniciarsesion");
			} else {
				setToken(auxToken);
				setUser(decodedToken);
				const user = {
					id: decodedToken.id,
					route: window.location.pathname,
				};
				Socket.emit("UPDATE_ROUTE", user);
				const data = {
					fullName: decodedToken.fullName,
				};
				updateStreamTimeApi(auxToken, data);
			}
		}
	}, []);

	useEffect(() => {
		let action = "pageView";
		let description = "";
		switch (saveData) {
			case 1:
				action = "Pregunta";
				description = "Pregunta enviada";
				break;
			case 2:
				action = "Footer";
				description = "Powered By Up";
				break;
			case 3:
				action = "Menu";
				description = "Activar notificaciones";
				break;
			case 4:
				action = "Menu";
				description = "Silenciar notificaciones";
				break;
			case 5:
				action = "Menu";
				description = "Abrir Chat";
				break;
			case 6:
				action = "Menu";
				description = "Cerrar Chat";
				break;
			default:
				break;
		}
		const data = {
			conectionType: window.conectionType,
			page: "/streaming",
			action,
			description,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		if (saveData === 2) {
			window.open("https://www.upwebinar.cl/", "_blank");
		}
	}, [saveData]);

	const handleClick = (e) => {
		setCurrent({ current: e.key });
	};

	return (
		<>
			<div className="asynchronous">
				<div className="back">
                    <div className="container">
                        <Link to="/salaespera">
                            <ArrowLeftOutlined /> <span>Volver</span>
                        </Link>
                        <div className="logo">
                            <img src={logo} alt="logo" width="180" />
                        </div>
                    </div>
                    <div className="subMenu desktop">
                        <Link href="/salaespera">Sala de espera</Link>
                        <a href="/salaespera#agenda">Agenda</a>
                        <a href="/salaespera#stands">Stands</a>
                        <Link to="/streaming" className="perfil">
                            Streaming
                        </Link>
                    </div>
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
								<Link className="opcion" to="/salaespera#agenda">
									Agenda
								</Link>
							</Menu.Item>
							<Menu.Item key="setting:3">
								<Link className="opcion" to="/salaespera#stands">
									stands
								</Link>
							</Menu.Item>
							<Menu.Item key="setting:4">
								<Link className="opcion" to="/streaming">
									Streaming
								</Link>
							</Menu.Item>
						</SubMenu>
					</Menu>
				</div>
				<div className="container">
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col className="gutter-row iframe" span={18}>
							<iframe src="https://player.vimeo.com/video/461210981?autoplay=1&loop=1&autopause=0" title="video"></iframe>
						</Col>
						<Col className="gutter-row" span={6}>
							<div className="module">
								<h3>Módulos</h3>
								<Radio.Group onChange={(e) => setRadioValue(e.target.value)} value={radioValue}>
									<Space direction="vertical">
										<Radio value={1}>1. Título video</Radio>
										<Radio value={2}>2. Título video</Radio>
										<Radio value={3}>3. Título video</Radio>
									</Space>
								</Radio.Group>
							</div>
							<div className="question">
								<Input placeholder="Enviar pregunta" suffix={<SendOutlined style={{ color: "#000" }} />} />
							</div>
						</Col>
					</Row>
				</div>
				<div className="container-test">
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						<Col className="gutter-row" span={18}>
							<div className="test">
								<h3>Realizar test</h3>
							</div>
							<div className="questions-test">
								<h1 className="question">¿Lorem ipsum dolor sit amet?</h1>
								<Radio.Group onChange={(e) => setTestValue(e.target.value)} value={testValue}>
									<Space direction="vertical">
										<Radio value={1}>
											<div className="answer">
												<h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod</h3>
											</div>
										</Radio>
										<Radio value={2}>
											<div className="answer">
												<h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod</h3>
											</div>
										</Radio>
									</Space>
								</Radio.Group>
								<Divider />
								<h1 className="question">¿Lorem ipsum dolor sit amet?</h1>
								<Radio.Group onChange={(e) => setTestValue2(e.target.value)} value={testValue2}>
									<Space direction="vertical">
										<Radio value={1}>
											<div className="answer">
												<h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod</h3>
											</div>
										</Radio>
										<Radio value={2}>
											<div className="answer">
												<h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod</h3>
											</div>
										</Radio>
									</Space>
								</Radio.Group>
								<Divider />
								<h1 className="question">¿Lorem ipsum dolor sit amet?</h1>
								<Radio.Group onChange={(e) => setTestValue3(e.target.value)} value={testValue3}>
									<Space direction="vertical">
										<Radio value={1}>
											<div className="answer">
												<h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod</h3>
											</div>
										</Radio>
										<Radio value={2}>
											<div className="answer">
												<h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod</h3>
											</div>
										</Radio>
									</Space>
								</Radio.Group>
								<div className="send-button">
									<button>Enviar</button>
								</div>
							</div>
						</Col>
						<Col className="gutter-row" span={6} />
					</Row>
				</div>
			</div>
			<Footer setSaveData={setSaveData} />
		</>
	);
};

export default Streaming;
