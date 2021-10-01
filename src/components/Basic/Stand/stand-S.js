/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { notification, Spin, Carousel } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import jwtDecode from "jwt-decode";
import Slider from "react-slick";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AlarmOnIcon from "@material-ui/icons/AlarmOn";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";

import header from "../../../assets/images/banner-stand.png";
import iframeImg from "../../../assets/images/iframe.png";
import carruselImg from "../../../assets/images/carrusel.png";

import close from "../../../assets/img/close.png";
import footer from "../../../assets/img/paginaweb.png";
import footer2 from "../../../assets/img/telefono.png";
import footer3 from "../../../assets/img/email.png";
// import pdf from "../../../assets/img/stand/cognitiva/pdf.pdf";

import { agendaGet, Agendar } from "../../../api/agenda";
import { eventApi } from "../../../api/events";
// import { emailValidation, minLengthValidation, rutValidation } from '../../../utils/formValidation';

import "./Stand.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	button: {
		margin: "0px",
	},
}));

const StandS = ({ url, setUrl, token, id }) => {
	const [selectedDate, setSelectedDate] = useState(0);
	const [dia, setDia] = useState(0);
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);
	const [idUsuario, setIdUsuario] = useState("6030020f11dc556d0599d445");
	const [idAgenda, setIdAgenda] = useState("");
	const [hora, setHora] = useState("");
	const [link, setLink] = useState("");
	const classes = useStyles();
	const [array, setArray] = useState([]);
	const [loading, setLoading] = useState(false);
	const [description, setDescription] = useState("");
	const [inputs, setInputs] = useState({
		description: "",
	});

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 2,
		slidesToScroll: 2,
	};

	const close2 = () => {
		const doc = document.getElementById("stand-s");
		doc.style.right = "-660px";
		doc.style.transitionDuration = "1s";
		const doc2 = document.getElementById("fondoStand");
		doc2.style.left = "100vw";
		doc2.style.transitionDuration = "1s";
		const bodi = document.getElementsByTagName("body");
		bodi[0].classList.remove("stop");
		setUrl("");
		const data2 = {
			conexionType: window.conectionType,
			page: "/salaespera",
			action: "Stand",
			description: `${id} - Cerrar Stand`,
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data2);
	};

	const abrirwsp = (numero) => {
		const url =
			"https://api.whatsapp.com/send/?phone=" +
			numero +
			"&text=Hola,%20vi%20el%20stand%20en%20el%20evento%20Up%20Webinar.%20Me%20gustaría%20saber%20más%20sobre%20ustedes&app_absent=0&lang=es";
		window.open(url, "_blank");
		const data = {
			conexionType: window.conectionType,
			page: "/salaespera",
			action: "Stand",
			description: `${id} - WhatsApp`,
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
	};

	const consultar = async (dia) => {
		setLoading(true);
		const data = {
			userId: idUsuario,
			day: dia,
		};
		const respuesta = await agendaGet(data, token);

		if (!respuesta.ok) {
		} else {
			setLoading(false);
			const arreglo = respuesta.agenda;
			// arreglo.forEach(element => {
			//     setArray([...array,element]);
			// });
			setDia(dia);
			llenarArreglo(arreglo);
		}
	};

	const agendar2 = () => {
		setOpen3(true);
	};

	const agendar = async () => {
		setLoading(true);
		const decodedToken = jwtDecode(token);
		if (!decodedToken) {
			window.location.href = "/iniciarsesion";
		}
		const data2 = {
			conexionType: window.conectionType,
			page: "/salaespera",
			action: "Stand",
			description: `${id} - Agendar`,
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data2);
		const data = {
			user: decodedToken.id,
			description: inputs.description,
		};
		if (idAgenda.trim().length > 1) {
			if (inputs.description.trim() !== "") {
				const respuesta = await Agendar(data, token, idAgenda);
				console.log(respuesta);

				if (!respuesta.ok) {
					notification["error"]({
						message: respuesta.message,
					});
					setLoading(false);
				} else {
					notification["success"]({
						message: "Hora agendada",
					});
					setLink(respuesta.link);
					setOpen2(true);
					setOpen3(false);
					setLoading(false);
				}
			} else {
				notification["error"]({
					message: "Ingrese una descripción",
				});
			}
		} else {
			notification["error"]({
				message: "Seleccione un horario",
			});
		}
	};

	const changeForm = (e) => {
		setInputs({
			...inputs,
			[e.target.name]: e.target.value,
		});
	};

	const llenarArreglo = (array2) => {
		setArray(array2);
	};

	const cancelar = () => {
		setDia(0);
		const arreglo = [];
		setArray(arreglo);
		setOpen(false);
		setIdAgenda("");
	};

	const cancelar2 = () => {
		setOpen3(false);
		setDescription("");
	};

	const cambioDeEstados = (id, hora) => {
		setIdAgenda(id);
		setHora(hora);
	};

	const finalizar = () => {
		setLink("");
		setHora("");
		setDia(0);
		setIdAgenda("");
		const arreglo = [];
		setArray(arreglo);
		setOpen(false);
		setOpen2(false);
	};

	const redirect = (link) => {
		window.open(link, "_blank");
	};

	// const descargarPDF = () => {
	// 	window.open(pdf, "_blank");
	// };

	const antIcon = <LoadingOutlined spin />;

	return (
		<>
			<div className="standMediano" id="stand-s">
				<img alt="alt" src={close} className="close" onClick={close2} />
				<div className="header2">
					<LazyLoadImage alt="alt2" effect="blur" src={header} width="100%" />
				</div>
				<div className="content2">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
						Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
					</p>
					<img src={iframeImg} alt="iframe" className="transmission" width="560" height="315" style={{ marginBottom: "15px" }} />
					<div className="imagenes">
						<Carousel slidesToShow={2}>
							<div className="imagen">
								<LazyLoadImage alt="alt2" src={carruselImg} width="100%" effect="blur" style={{ cursor: "pointer" }} />
							</div>
							<div className="imagen">
								<LazyLoadImage alt="alt2" src={carruselImg} width="100%" effect="blur" style={{ cursor: "pointer" }} />
							</div>
							<div className="imagen">
								<LazyLoadImage alt="alt2" src={carruselImg} width="100%" effect="blur" style={{ cursor: "pointer" }} />
							</div>
							<div className="imagen">
								<LazyLoadImage alt="alt2" src={carruselImg} width="100%" effect="blur" style={{ cursor: "pointer" }} />
							</div>
							<div className="imagen">
								<LazyLoadImage alt="alt2" src={carruselImg} width="100%" effect="blur" style={{ cursor: "pointer" }} />
							</div>
						</Carousel>
					</div>
					<div className="botones">
						{/* <div className="mitad">
							<button
								className="btn2"
								onClick={() => abrirwsp("56961949680")}
							>
								Hablar por WhatsApp
							</button>
						</div> */}
						{/* <div className="mitad">
							<button
								className="btn3"
								onClick={() => setOpen(true)}
							>
								Agendar Reunión
							</button>
						</div> */}
						{/* <button className="btn1" onClick={() => descargarPDF()}>
							Mas información
						</button> */}
					</div>
				</div>
				{/* <div className="boton">
                    <a href="" target="_blank" rel="noopener noreferrer">MÁS INFORMACIÓN</a>
            </div> */}

				{/* <div className="foot2">
					<div className="itemFooter">
						<img src={footer} alt="footer" />
						<a>healthtechgroup.cl</a>
					</div>
					<div className="itemFooter">
						<img src={footer3} alt="footer3" />
						<a href="mailto:mbeale@revistainvitro.cl">mbeale@revistainvitro.cl</a>
					</div>

					<div className="itemFooter">
						<img src={footer2} alt="footer2" />
						<a href="tel:+56961949680">+56961949680</a>
					</div>
				</div> */}
			</div>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setOpen(false)}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						{dia === 0 ? (
							<>
								<div className="tituloDialog">
									<CancelIcon className="icono2" onClick={() => setOpen(false)} />
									<h1>SELECCIONA DÍA</h1>
								</div>
								<div className="dias">
									<div>
										<Button
											variant="contained"
											color="primary"
											className={classes.button}
											onClick={() => consultar(24)}
											startIcon={<DateRangeIcon className="icon" />}
										>
											24 de Marzo del 2021
										</Button>
									</div>
									<div>
										<Button
											variant="contained"
											color="primary"
											className={classes.button}
											onClick={() => consultar(25)}
											startIcon={<DateRangeIcon className="icon" />}
										>
											25 de Marzo del 2021
										</Button>
									</div>
									<div>
										<Button
											variant="contained"
											color="primary"
											className={classes.button}
											onClick={() => consultar(26)}
											startIcon={<DateRangeIcon className="icon" />}
										>
											26 de Marzo del 2021
										</Button>
									</div>
								</div>
							</>
						) : (
							<>
								<div className="tituloDialog">
									<CancelIcon className="icono" onClick={() => setDia(0)} />
									<h1 className="titulin">ELIGE UN HORARIO</h1>
								</div>
								{/* <div className="subtitulo">
                                    <span>Miércoles 17 de Febrero del 2021</span>
                                </div> */}
								<div className="horas">
									{array.length > 1 ? (
										array.map((item, i) => {
											return (
												<div>
													<Button
														variant="contained"
														color="primary"
														className="button"
														startIcon={<ScheduleIcon />}
														onClick={() => cambioDeEstados(item._id, item.hour)}
													>
														{item.hour}
													</Button>
												</div>
											);
										})
									) : (
										<p>No hay horarios disponibles</p>
									)}
								</div>
								<div className="botones2">
									<div>
										<Button
											variant="contained"
											color="primary"
											className="btn1"
											startIcon={<HighlightOffIcon />}
											onClick={cancelar}
										>
											Cancelar
										</Button>
									</div>
									<div>
										<Button
											variant="contained"
											color="primary"
											className="btn2"
											startIcon={<AlarmOnIcon />}
											onClick={() => agendar2()}
										>
											Agendar
										</Button>
									</div>
								</div>
							</>
						)}
					</DialogContentText>
				</DialogContent>
				<DialogActions></DialogActions>
			</Dialog>
			<Dialog
				open={open2}
				TransitionComponent={Transition}
				keepMounted
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogContent>
					<div className="confirmacionAgenda">
						<div className="done">
							<CheckCircleIcon className="icon" />
						</div>
						<div className="titulo">
							<h1>Tu reunión está agendada</h1>
							<div>
								<span>
									<DateRangeIcon className="icono" /> {dia}
									-01-2021
								</span>
								<span>
									<ScheduleIcon className="icono" /> {hora} hrs
								</span>
							</div>
						</div>
						<div className="link">
							<span>
								Link de ingreso:{" "}
								<a href={link} target="_blank" rel="noopener noreferrer">
									{" "}
									{link}{" "}
								</a>{" "}
							</span>
						</div>
						<div className="divi">
							<Button variant="contained" color="primary" className="btn2" startIcon={<CheckCircleOutlineIcon />} onClick={finalizar}>
								Aceptar
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<Dialog
				open={open3}
				TransitionComponent={Transition}
				keepMounted
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogContent>
					<Spin spinning={loading} size="large" tip="Cargando..." indicator={antIcon}>
						<div className="description" id="description" style={{ zIndex: "999px" }}>
							<div className="titulo">
								<h1>Ingrese una descripción</h1>
							</div>
							<div className="des">
								<TextField
									id="outlined-basic"
									label="Descripción"
									variant="outlined"
									className="input"
									type="text"
									name="description"
									onChange={changeForm}
									value={inputs.description}
								/>
							</div>
							<div className="botones2">
								<div>
									<Button variant="contained" color="primary" className="btn1" startIcon={<HighlightOffIcon />} onClick={cancelar2}>
										Cancelar
									</Button>
								</div>
								<div>
									<Button
										variant="contained"
										color="primary"
										className="btn2"
										startIcon={<AlarmOnIcon />}
										onClick={() => agendar()}
									>
										Agendar
									</Button>
								</div>
							</div>
						</div>
					</Spin>
				</DialogContent>
			</Dialog>

			{/* </div> */}
		</>
	);
};

export default StandS;
