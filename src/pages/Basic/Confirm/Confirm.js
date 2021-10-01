/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import AppleIcon from "@material-ui/icons/Apple";
import EventIcon from "@material-ui/icons/Event";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import moment from "moment";
import "moment/locale/es";

import { eventApi } from "../../../api/events";
import { getAccessTokenApi } from "../../../api/auth";
import Socket from "../../../utils/socket";

import logo from "../../../assets/images/photo.png";

import "./Confirm.scss";

const Confirmacion = () => {
	const history = useHistory();

	const [saveData, setSaveData] = useState(0);
	const [fullDate, setFullDate] = useState("");
	const [fullEndDate, setFullEndDate] = useState("");
	const [date, setDate] = useState("");
	const [hour, setHour] = useState("");

	useEffect(() => {
		getData();
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
				action = "Boton";
				description = "Agregar a mi calendario";
				break;
			case 2:
				action = "Boton";
				description = "Apple Calendar";
				break;
			case 3:
				action = "Boton";
				description = "Google Calendar";
				break;
			case 4:
				action = "Boton";
				description = "Outlook";
				break;
			case 5:
				action = "Boton";
				description = "Iniciar sesión";
				break;
			default:
				break;
		}
		const data = {
			conectionType: window.conectionType,
			page: "/confirmacion",
			action,
			description,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		if (saveData === 5) {
			history.push("/iniciarsesion");
		}
	}, [saveData]);

	const abrirCerrar = () => {
		let doc = document.getElementById("opciones");
		let doc2 = document.getElementById("btn");
		if (doc.style.height === "0px") {
			doc.style.height = "auto";
			doc.style.transitionDuration = "1s";
			doc2.style.background = "transparent";
			doc2.style.position = "absolute";
			setSaveData(1);
		} else {
			doc.style.height = "0px";
			doc.style.transitionDuration = "1s";
			doc2.style.zIndex = "9999";
			doc2.style.background = "linear-gradient(#ff7c7b, #ffc160)";
		}
	};

	const abrirOutlook = (calendario) => {
		if (calendario === "Apple") {
			setSaveData(2);
		} else {
			setSaveData(4);
		}
		const d1 = new Date(fullDate);
		const d2 = new Date(fullEndDate);

		let d1_str, d2_str;

		const title = "Up Webinar";

		const d1_y = d1.getFullYear();
		const d1_m = ("0" + (d1.getMonth() + 1)).slice(-2);
		const d1_d = ("0" + d1.getDate()).slice(-2);
		const d1_hh = ("0" + d1.getHours()).slice(-2);
		const d1_mm = ("0" + d1.getMinutes()).slice(-2);

		const d2_y = d2.getFullYear();
		const d2_m = ("0" + (d2.getMonth() + 1)).slice(-2);
		const d2_d = ("0" + d2.getDate()).slice(-2);
		const d2_hh = ("0" + d2.getHours()).slice(-2);
		const d2_mm = ("0" + d2.getMinutes()).slice(-2);

		d1_str = d1_y + d1_m + d1_d + "T" + d1_hh + d1_mm + "00";
		d2_str = d2_y + d2_m + d2_d + "T" + d2_hh + d2_mm + "00";
		const newEvent = {
			BEGIN: "VCALENDAR",
			PRODID: `${window.location.protocol}//${window.location.hostname}`,
			UID: `${window.location.protocol}//${window.location.hostname}`,
			DTSTART: d1_str,
			DTEND: d2_str,
			SUMMARY: title,
			DESCRIPTION: title,
			END: "VCALENDAR",
		};
		let formattedDate = formatDate(newEvent.DTSTART);
		let formattedEndDate = formatDate(newEvent.DTEND);
		// eslint-disable-next-line no-undef
		let cal = ics();
		cal.addEvent(newEvent.SUMMARY, newEvent.DESCRIPTION, newEvent.PRODID, formattedDate, formattedEndDate);

		cal.download(title);
	};

	const abrirGoogleCalendar = () => {
		setSaveData(3);
		let str_api, str_location, str_start, str_end, str_title, str_details, extras;

		const d1 = new Date(fullDate);
		const d2 = new Date(fullEndDate);

		let d1_str, d2_str;

		const d1_y = d1.getFullYear();
		const d1_m = ("0" + (d1.getMonth() + 1)).slice(-2);
		const d1_d = ("0" + d1.getDate()).slice(-2);
		const d1_hh = ("0" + d1.getHours()).slice(-2);
		const d1_mm = ("0" + d1.getMinutes()).slice(-2);

		const d2_y = d2.getFullYear();
		const d2_m = ("0" + (d2.getMonth() + 1)).slice(-2);
		const d2_d = ("0" + d2.getDate()).slice(-2);
		const d2_hh = ("0" + d2.getHours()).slice(-2);
		const d2_mm = ("0" + d2.getMinutes()).slice(-2);

		d1_str = d1_y + d1_m + d1_d + "T" + d1_hh + d1_mm + "00";
		d2_str = d2_y + d2_m + d2_d + "T" + d2_hh + d2_mm + "00";

		const title = "Up Webinar";
		str_api = "https://calendar.google.com/calendar/render?action=TEMPLATE";
		str_title = "&text=";
		str_details = "&details=";
		str_location = "&location=";
		str_start = "&dates=";
		str_end = "/";
		extras = "&pli=1&sf=true&output=xml";
		const link = `${str_api}${str_title}${title}${str_details}${title}${str_start}${d1_str}${str_end}${d2_str}${str_location}${window.location.protocol}//${window.location.hostname}${extras}`;
		window.open(link, "_blank");
	};

	const abrirsesion = () => {
		setSaveData(5);
	};

	const getData = () => {
		let getTimeZone = window.timeZone;
		if (getTimeZone === undefined || getTimeZone === "undefined") {
			getTimeZone = "America/Santiago";
		}
		const eventTime = "2021-08-04T09:00:00";
		const localTimeZone = moment(eventTime).format();
		setFullDate(moment(localTimeZone).format());
		setFullEndDate(moment(localTimeZone).add(1, "days").add(3, "hours").format());
		setDate("Fecha del evento");
		setHour("Hora del evento");
	};

	return (
		<>
			<div className="fondo">
				<div className="contenedorConfirmacion">
					<div className="oscuro">
						<img src={logo} alt="logo" className="img" />
					</div>
					{/* <img src={logo2} alt="logo" className="img2" /> */}
					<div className="fondo2">
						<h2>Texto éxito del Registro</h2>
						<p>Fecha del evento</p>
						<div className="card">
							<div className="letras">
								<div>
									<EventIcon className="logo" alt="calendario" />
									<span> {date}</span>
								</div>
								<div>
									<AccessTimeIcon className="logo" alt="reloj" />
									<span>{hour}</span>
								</div>
							</div>
							<div className="boton">
								<div className="fondo3">
									<button id="btn" onClick={abrirCerrar}>
										<p>Agregar a mi calendario</p>
									</button>
									<div className="opciones border" id="opciones">
										<button onClick={() => abrirOutlook("Apple")}>
											{" "}
											<AppleIcon className="icon2" />
											Apple Calendar{" "}
										</button>
										<button className="blanco" onClick={abrirGoogleCalendar}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
												focusable="false"
												data-prefix="fab"
												data-icon="google"
												class="svg-inline--fa fa-google fa-w-16 icon"
												role="img"
												viewBox="0 0 488 512"
											>
												<path
													fill="currentColor"
													d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
												/>
											</svg>{" "}
											Google{" "}
										</button>
										<button className="border" onClick={() => abrirOutlook("Outlook")}>
											{" "}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
												focusable="false"
												data-prefix="fab"
												data-icon="windows"
												class="svg-inline--fa fa-windows fa-w-14 icon"
												role="img"
												viewBox="0 0 448 512"
											>
												<path
													fill="currentColor"
													d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"
												/>
											</svg>
											Outlook{" "}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="card2">
							<div>
								<span>Link de ingreso:</span>
								<input type="text" placeholder="Link de ingreso" defaultValue="https://upwebinar.cl/" />
							</div>
							<div className="boton">
                                <button onClick={abrirsesion}>Ir a la sala</button>
                            </div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-confirmacion" />
		</>
	);
};

export default Confirmacion;

function formatDate(dateString) {
	return dateString.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6");
}
