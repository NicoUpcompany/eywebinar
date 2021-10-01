/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";

import RegisterForm from "../../../../components/Basic/RegisterForm/RegisterForm";
import { eventApi } from "../../../../api/events";
import { getAccessTokenApi } from "../../../../api/auth";
import Socket from "../../../../utils/socket";

import fondo from "../../../../assets/images/signUp.png";

import "./SignUp.scss";

const SignUp = () => {
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [saveData, setSaveData] = useState(0);

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
				description = "Ya estoy registrado";
				break;
			case 2:
				action = "Boton";
				description = "Registrar";
				break;
			default:
				break;
		}

		const data = {
			conectionType: window.conectionType,
			page: "/registro",
			action,
			description,
			userId: localStorage.getItem("userID"),
		};

		eventApi(data);

		if (saveData === 1) {
			history.push("/iniciarsesion");
		}
		if (saveData === 2) {
			history.push("/confirmacion");
		}
	}, [saveData]);

	const antIcon = <LoadingOutlined spin />;

	return (
		<Spin spinning={loading} size="large" tip="Cargando..." indicator={antIcon}>
			<div className="fondo">
				<div className="row">
					<div className="col3">
						<img src={fondo} alt="fondo" className="fondoMovil" />
					</div>
					<div className="col4">
						<h2>Regístrate</h2>
						<p>Evento gratuito</p>
						<RegisterForm setSaveData={setSaveData} setLoading={setLoading} />
						{/* <a onClick={() => setSaveData(1)}>Ya estoy registrado</a> */}
					</div>
				</div>
			</div>
		</Spin>
	);
};

export default SignUp;
