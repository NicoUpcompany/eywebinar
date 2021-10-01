/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import moment from "moment";

import logo from "../../../../assets/images/photo.png";
import { getTime } from "../../../../api/time";
import { eventApi } from "../../../../api/events";
import { getAccessTokenApi } from "../../../../api/auth";
import FormLogin from "../../../../components/Basic/LoginForm/LoginForm";
import Socket from "../../../../utils/socket";
import login from '../../../../assets/img/login.png';

import "./SignIn.scss";

const SignIn = () => {
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [saveData, setSaveData] = useState(false);
	const [state, setState] = useState(true);

	useEffect(() => {
		const token = getAccessTokenApi();
		if (token !== null) {
			const decodedToken = jwtDecode(token);
			if (decodedToken) {
				const user = {
					id: decodedToken.id,
					route: window.location.pathname,
				};
				Socket.emit("UPDATE_ROUTE", user);
			}
		}
	}, []);

	useEffect(() => {
		let action = "pageView";
		let description = "";
		switch (saveData) {
			case 1:
				action = "Link";
				description = "Aún no estoy registrado";
				break;
			case 2:
				action = "Boton";
				description = "Ingresar";
				break;
			default:
				break;
		}
		const data = {
			conectionType: window.conectionType,
			page: "/iniciarsesion",
			action,
			description,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		if (saveData === 1) {
			history.push("/iniciarsesion");
		}
		if (saveData === 2) {
			history.push("/streaming");
		}
	}, [saveData]);

	useEffect(() => {
		let interval;
		getTime2(interval);
	}, []);

	const getTime2 = async (interval) => {
		setLoading(true);
		try {
			const resp = await getTime();
			const timeApi = moment(resp.time).valueOf();
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
						setLoading(false);
						setState(false);
						clearInterval(interval);
					}
					now = moment(now).add(1, "seconds").valueOf();
				}, 1000);
			});
		} catch (exception) {
			setLoading(false);
			console.log(exception);
		}
	};

	const antIcon = <LoadingOutlined spin />;

	return (
		<Spin spinning={loading} size="large" tip="Cargando..." indicator={antIcon}>
			<div className="fondo">
				<div className="contenedorRegistro">
					{/* <div className="oscuro">
						<img src={logo} alt="logo" className="titulo" />
					</div> */}
					<div className="row">
						{/* <img
							src={login}
						/> */}
						<div className="form">
							{/* <h1 className="ingresar">Ingresar</h1>
							<span id="login" className="login">
								Fecha del evento
							</span> */}
							{state ? (
								<div className="cronometro">
									<div>
										<h1> </h1>
										<span>Día</span>
									</div>
									<div>
										<h1> </h1>
										<span>Hora</span>
									</div>
									<div>
										<h1> </h1>
										<span>Minutos</span>
									</div>
									<div>
										<h1> </h1>
										<span>Segundos</span>
									</div>
								</div>
							) : null}
							<div div className="card">
								<FormLogin setLoading={setLoading} setSaveData={setSaveData} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</Spin>
	);
};

export default SignIn;
