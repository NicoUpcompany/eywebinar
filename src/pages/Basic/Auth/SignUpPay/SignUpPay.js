/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Form, Spin, Button, Row, Col, notification, Card, Divider, Drawer, Checkbox } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import DateRangeIcon from "@material-ui/icons/DateRange";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";

import { eventApi } from "../../../../api/events";
import { getAccessTokenApi } from "../../../../api/auth";
import { MakePaymentApi } from "../../../../api/payment";
import Socket from "../../../../utils/socket";
import { emailValidation, minLengthValidation } from "../../../../utils/formValidation";

import logo from "../../../../assets/images/logo.png";

import "./SignUpPay.scss";

const SignUpPay = () => {
	const history = useHistory();

	const [inputs, setInputs] = useState({
		email: "",
		name: "",
		lastname: "",
		position: "",
		enterprise: "",
		phone: "",
		sector: "",
	});
	const [formValid, setFormValid] = useState({
		email: false,
		name: false,
		lastname: false,
		position: false,
		enterprise: false,
		phone: false,
		sector: false,
	});
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [saveData, setSaveData] = useState(0);
	const [users, setUsers] = useState([]);
	const [amount, setAmount] = useState(0);
	const [iva, setIva] = useState(0);
	const [total, setTotal] = useState(0);
	const [amountString, setAmountString] = useState("");
	const [ivaString, setIvaString] = useState("");
	const [totalString, setTotalString] = useState("");
	const [days, setDays] = useState({
		day1: false,
		day2: false,
		day3: false,
		day4: false,
		day5: false,
		day6: false,
	});
	const [state, setState] = useState(true);
	const [terms, setTerms] = useState(false);
	const [linkPay, setLinkPay] = useState("");

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
				action = "Finalizar compra";
				description = "Redirección pago";
				break;
			default:
				break;
		}

		const data = {
			conectionType: window.conectionType,
			page: "/registro-pago",
			action,
			description,
			userId: localStorage.getItem("userID"),
		};

		eventApi(data);

		if (saveData === 1) {
			setSaveData(0);
			setLoading(false);
			window.open(linkPay);
		}
	}, [saveData]);

	useEffect(() => {
		if (users.length <= 0) {
			setVisible(false);
			setState(true);
		}
	}, [users]);

	useEffect(() => {
		if (users.length > 0) {
			let cont = 0;
			if (days.day1) {
				cont = cont + 1;
			}
			if (days.day2) {
				cont = cont + 1;
			}
			if (days.day3) {
				cont = cont + 1;
			}
			if (days.day4) {
				cont = cont + 1;
			}
			if (days.day5) {
				cont = cont + 1;
			}
			if (days.day6) {
				cont = cont + 1;
			}
			users.forEach((element) => {
				if (element.days.day1) {
					cont = cont + 1;
				}
				if (element.days.day2) {
					cont = cont + 1;
				}
				if (element.days.day3) {
					cont = cont + 1;
				}
				if (element.days.day4) {
					cont = cont + 1;
				}
				if (element.days.day5) {
					cont = cont + 1;
				}
				if (element.days.day6) {
					cont = cont + 1;
				}
			});
			setAmount(cont * 50000);
			setAmountString(numberToString(cont * 50000));
		} else {
			let cont = 0;
			if (days.day1) {
				cont = cont + 1;
			}
			if (days.day2) {
				cont = cont + 1;
			}
			if (days.day3) {
				cont = cont + 1;
			}
			if (days.day4) {
				cont = cont + 1;
			}
			if (days.day5) {
				cont = cont + 1;
			}
			if (days.day6) {
				cont = cont + 1;
			}
			setAmount(cont * 50000);
			setAmountString(numberToString(cont * 50000));
		}
	}, [days, users]);

	useEffect(() => {
		if (amount > 0) {
			setIva((amount * 19) / 100);
			setIvaString(numberToString((amount * 19) / 100));
		} else {
			setIva(0);
			setIvaString(numberToString(0));
		}
	}, [amount]);

	useEffect(() => {
		setTotal(amount + iva);
		setTotalString(numberToString(amount + iva));
	}, [iva]);

	const changeForm = (e) => {
		setInputs({
			...inputs,
			[e.target.name]: e.target.value,
		});
	};

	const inputValidation = async (e) => {
		const { type, name } = e.target;

		if (type === "email") {
			setFormValid({
				...formValid,
				[name]: emailValidation(e.target),
			});
		}
		if (type === "text") {
			setFormValid({
				...formValid,
				[name]: minLengthValidation(e.target, 2),
			});
		}
	};

	const addUser = () => {
		setLoading(true);
		const valName = inputs.name;
		const valLastname = inputs.lastname;
		const valEmail = inputs.email;
		const valPosition = inputs.position;
		const valEnterprise = inputs.enterprise;
		const valPhone = inputs.phone;
		const nameValid = formValid.name;
		const lastnameValid = formValid.lastname;
		const emailValid = formValid.email;
		const positionValid = formValid.position;
		const enterpriseValid = formValid.enterprise;
		const phoneValid = formValid.phone;

		if (!valName || !valLastname || !valEmail || !valPosition || !valEnterprise || !valPhone) {
			notification["error"]({
				message: "Todos los campos son obligatorios",
			});
			setLoading(false);
		} else if (!nameValid) {
			notification["error"]({
				message: "Ingrese un nombre válido",
			});
			setLoading(false);
		} else if (!lastnameValid) {
			notification["error"]({
				message: "Ingrese un apellido válido",
			});
			setLoading(false);
		} else if (!emailValid) {
			notification["error"]({
				message: "Ingrese un email válido",
			});
			setLoading(false);
		} else if (!positionValid) {
			notification["error"]({
				message: "Ingrese un cargo válido",
			});
			setLoading(false);
		} else if (!enterpriseValid) {
			notification["error"]({
				message: "Ingrese una empresa válido",
			});
			setLoading(false);
		} else if (!phoneValid) {
			notification["error"]({
				message: "Ingrese un teléfono válido",
			});
			setLoading(false);
		} else {
			const data = {
				id: users.length,
				...inputs,
				days,
			};
			const usersAux = users;
			usersAux.push(data);
			setUsers(usersAux);
			setInputs({
				email: "",
				name: "",
				lastname: "",
				position: "",
				enterprise: "",
				phone: "",
				sector: "",
			});
			setFormValid({
				email: false,
				name: false,
				lastname: false,
				position: false,
				enterprise: false,
				phone: false,
				sector: false,
			});
			setDays({
				day1: false,
				day2: false,
				day3: false,
				day4: false,
				day5: false,
				day6: false,
			});
			setVisible(true);
			setLoading(false);
		}
	};

	const deleteUser = (id) => {
		let usersAux = users;
		usersAux = usersAux.filter((u) => u.id !== id);
		setUsers(usersAux);
	};

	const editUser = (user) => {
		setInputs({
			email: user.email,
			name: user.name,
			lastname: user.lastname,
			position: user.position,
			enterprise: user.enterprise,
			phone: user.phone,
			sector: user.sector,
		});
		setFormValid({
			email: true,
			name: true,
			lastname: true,
			position: true,
			enterprise: true,
			phone: true,
			sector: true,
		});
		setDays({
			day1: user.days.day1,
			day2: user.days.day2,
			day3: user.days.day3,
			day4: user.days.day4,
			day5: user.days.day5,
			day6: user.days.day6,
		});
		setState(true);
		setVisible(false);
		let usersAux = users;
		usersAux = usersAux.filter((u) => u.id !== user.id);
		setUsers(usersAux);
	};

	const goPay = () => {
		if (users.length > 0) {
			setState(false);
			setVisible(false);
		} else {
			notification["error"]({
				message: "Debes agregar al menos un usuario",
			});
		}
	};

	const pay = async () => {
		setLoading(true);
		if (terms) {
			const data = {
				value: total,
				email: users[0].email,
				name: users[0].name,
				lastname: users[0].lastname,
				position: users[0].position,
				enterprise: users[0].enterprise,
				phone: users[0].phone,
				sector: users[0].sector,
			};
			const resultPay = await MakePaymentApi(data);
			if (resultPay.ok) {
				setLinkPay(resultPay.response.payUrl[1].url);
                setSaveData(1);
			} else {
				notification["error"]({
					message: resultPay.message,
				});
				setLoading(false);
			}
		} else {
			notification["error"]({
				message: "Debes aceptar los términos y condiciones",
			});
			setLoading(false);
		}
	};

	const antIcon = <LoadingOutlined spin />;

	return (
		<Spin spinning={loading} size="large" tip="Cargando..." indicator={antIcon}>
			<div className="container-pay">
				<div className="header">
					<img src={logo} alt="logo" />
				</div>
				<div className="content">
					<Row>
						<Col span={12}>
							{state ? (
								<Form onChange={changeForm} onFinish={addUser}>
									<div className="inscription">
										<h1 className="title">Inscripción</h1>
										<div className="campo">
											<div className="mitad">
												<input
													id="name"
													type="text"
													name="name"
													placeholder="Nombre"
													value={inputs.name}
													onChange={inputValidation}
												/>
												<label>Nombre</label>
											</div>
											<div className="mitad">
												<input
													id="lastname"
													name="lastname"
													type="text"
													placeholder="Apellidos"
													value={inputs.lastname}
													onChange={inputValidation}
												/>
												<label>Apellidos</label>
											</div>
										</div>
										<div className="campo">
											<div className="mitad">
												<input
													type="email"
													id="email"
													placeholder="Correo electrónico"
													name="email"
													value={inputs.email}
													onChange={inputValidation}
												/>
												<label>Correo electrónico</label>
											</div>
											<div className="mitad">
												<input
													type="text"
													id="phone"
													name="phone"
													placeholder="Teléfono (+56)"
													value={inputs.phone}
													onChange={inputValidation}
												/>
												<label>Teléfono (+56)</label>
											</div>
										</div>
										<div className="campo">
											<div className="mitad">
												<input
													type="text"
													id="enterprise"
													placeholder="Institución/empresa"
													name="enterprise"
													value={inputs.enterprise}
													onChange={inputValidation}
												/>
												<label>Institución/empresa</label>
											</div>
											<div className="mitad">
												<input
													type="text"
													id="position"
													placeholder="Cargo"
													name="position"
													value={inputs.position}
													onChange={inputValidation}
												/>
												<label>Cargo</label>
											</div>
										</div>
									</div>
									<div className="days">
										<h1 className="title">Qué días asistirá</h1>
										<Row>
											<Col span={4}>
												<div
													className={days.day1 ? "day-container active" : "day-container"}
													onClick={() => setDays({ ...days, day1: !days.day1 })}
												>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 1</p>
												</div>
											</Col>
											<Col span={4}>
												<div
													className={days.day2 ? "day-container active" : "day-container"}
													onClick={() => setDays({ ...days, day2: !days.day2 })}
												>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 2</p>
												</div>
											</Col>
											<Col span={4}>
												<div
													className={days.day3 ? "day-container active" : "day-container"}
													onClick={() => setDays({ ...days, day3: !days.day3 })}
												>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 3</p>
												</div>
											</Col>
											<Col span={4}>
												<div
													className={days.day4 ? "day-container active" : "day-container"}
													onClick={() => setDays({ ...days, day4: !days.day4 })}
												>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 4</p>
												</div>
											</Col>
											<Col span={4}>
												<div
													className={days.day5 ? "day-container active" : "day-container"}
													onClick={() => setDays({ ...days, day5: !days.day5 })}
												>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 5</p>
												</div>
											</Col>
											<Col span={4}>
												<div
													className={days.day6 ? "day-container active" : "day-container"}
													onClick={() => setDays({ ...days, day6: !days.day6 })}
												>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 6</p>
												</div>
											</Col>
										</Row>
									</div>
									<div className="button-container">
										<Button htmlType="submit" className="btn">
											Agregar
										</Button>
									</div>
								</Form>
							) : (
								<div className="resume">
									<h1 className="title">Datos inscritos</h1>
									{users.map((item, i) => {
										return (
											<div key={i}>
												<div className="user-data">
													<div className="first-line">
														<p className="username">
															{item.name} {item.lastname}
														</p>
														<p className="edit">
															<p onClick={() => editUser(item)}>Editar</p>
															<p onClick={() => deleteUser(item.id)}>Eliminar</p>
														</p>
													</div>
													<div className="description">
														<p className="data">
															{item.email} - {item.phone} - {item.enterprise} - {item.position}
														</p>
													</div>
													<div className="days">
														<Row>
															<Col span={4}>
																<div className={item.days.day1 ? "day-container active" : "day-container"}>
																	<DateRangeIcon className="calendar" />
																	<p className="day">Día 1</p>
																</div>
															</Col>
															<Col span={4}>
																<div className={item.days.day2 ? "day-container active" : "day-container"}>
																	<DateRangeIcon className="calendar" />
																	<p className="day">Día 2</p>
																</div>
															</Col>
															<Col span={4}>
																<div className={item.days.day3 ? "day-container active" : "day-container"}>
																	<DateRangeIcon className="calendar" />
																	<p className="day">Día 3</p>
																</div>
															</Col>
															<Col span={4}>
																<div className={item.days.day4 ? "day-container active" : "day-container"}>
																	<DateRangeIcon className="calendar" />
																	<p className="day">Día 4</p>
																</div>
															</Col>
															<Col span={4}>
																<div className={item.days.day5 ? "day-container active" : "day-container"}>
																	<DateRangeIcon className="calendar" />
																	<p className="day">Día 5</p>
																</div>
															</Col>
															<Col span={4}>
																<div className={item.days.day6 ? "day-container active" : "day-container"}>
																	<DateRangeIcon className="calendar" />
																	<p className="day">Día 6</p>
																</div>
															</Col>
														</Row>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</Col>
						<Col span={12} className="total-container">
							<Card title="Resumen de pago" className="card">
								<div className="amount">
									<p>Subtotal</p>
									<p>${amountString}</p>
								</div>
								<div className="amount">
									<p>Iva</p>
									<p>${ivaString}</p>
								</div>
								<Divider />
								<div className="total-amount">
									<p className="total">Total</p>
									<p className="sum">${totalString}</p>
								</div>
								<Divider />
								{state ? (
									<div className="next-container">
										<button className="btn" onClick={goPay}>
											Siguiente
										</button>
									</div>
								) : (
									<div className="next-container">
										<button className="btn" onClick={pay}>
											Pagar
										</button>
										<br />
										<Checkbox checked={terms} onChange={() => setTerms(!terms)}>
											Al comprar acepto los términos y condiciones
										</Checkbox>
									</div>
								)}
							</Card>
						</Col>
					</Row>
				</div>
			</div>
			<Drawer
				title="Evento agregado exitosamente"
				className="pay-drawer"
				placement="right"
				width={720}
				onClose={() => setVisible(false)}
				visible={visible}
			>
				<div className="drawer-container">
					{users.map((item, i) => {
						return (
							<div key={i}>
								<div className="user-data">
									<div className="first-line">
										<p className="username">
											{item.name} {item.lastname}
										</p>
										<p className="edit">
											<p onClick={() => editUser(item)}>Editar</p>
											<CloseIcon className="close" onClick={() => deleteUser(item.id)} />
										</p>
									</div>
									<div className="description">
										<p className="data">
											{item.email} - {item.phone} - {item.enterprise} - {item.position}
										</p>
									</div>
									<div className="days">
										<Row>
											<Col span={4}>
												<div className={item.days.day1 ? "day-container active" : "day-container"}>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 1</p>
												</div>
											</Col>
											<Col span={4}>
												<div className={item.days.day2 ? "day-container active" : "day-container"}>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 2</p>
												</div>
											</Col>
											<Col span={4}>
												<div className={item.days.day3 ? "day-container active" : "day-container"}>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 3</p>
												</div>
											</Col>
											<Col span={4}>
												<div className={item.days.day4 ? "day-container active" : "day-container"}>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 4</p>
												</div>
											</Col>
											<Col span={4}>
												<div className={item.days.day5 ? "day-container active" : "day-container"}>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 5</p>
												</div>
											</Col>
											<Col span={4}>
												<div className={item.days.day6 ? "day-container active" : "day-container"}>
													<DateRangeIcon className="calendar" />
													<p className="day">Día 6</p>
												</div>
											</Col>
										</Row>
									</div>
								</div>
								<Divider />
							</div>
						);
					})}
				</div>
				<div className="drawer-options">
					<button className="finish" onClick={goPay}>
						Finalizar Compra
					</button>
					<button className="keep-shoping" onClick={() => setVisible(false)}>
						Seguir Agregando
					</button>
				</div>
			</Drawer>
		</Spin>
	);
};

export default SignUpPay;

function numberToString(value) {
	const moneyDots = value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
	return moneyDots;
}
