/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { notification } from "antd";
import { CometChat } from "@cometchat-pro/chat";
import jwtDecode from "jwt-decode";
import { withStyles } from "@material-ui/core/styles";
// import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import { isSafari, isMobileSafari } from "react-device-detect";

import { signInApi } from "../../../api/user";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../utils/constants";
import { COMETCHAT_CONSTANTS } from "../../../consts";
import { emailValidation } from "../../../utils/formValidation";

import "./LoginForm.scss";

const ColorButton = withStyles((theme) => ({
	root: {
		color: "white",
		background: "linear-gradient(90deg, rgba(177,179,1,1) 26%, rgba(249,255,0,1) 100%);",
		"&:hover": {
			background: " linear-gradient(90deg, rgba(177,179,1,1) 26%, rgba(249,255,0,1) 100%);",
		},
	},
}))(Button);

const LoginForm = (props) => {
	const [inputs, setInputs] = useState({
		email: "",
	});
	const [formValid, setFormValid] = useState({
		email: false,
	});
	const { setLoading, setSaveData } = props;

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
	};

	const signIn = async () => {
		setLoading(true);
		const result = await signInApi(inputs);
		if (!result.ok) {
			notification["error"]({
				message: result.message,
			});
			setLoading(false);
		} else {
			const { accessToken, refreshToken } = result;
			localStorage.setItem(ACCESS_TOKEN, accessToken);
			localStorage.setItem(REFRESH_TOKEN, refreshToken);
			const decodedToken = jwtDecode(accessToken);
			const user = new CometChat.User(decodedToken.id);
			const UID = decodedToken.id;
			const apiKey = COMETCHAT_CONSTANTS.AUTH_KEY;
			if (decodedToken.email.length > 0) {
				user.setName(`${decodedToken.name} ${decodedToken.lastname} | ${decodedToken.enterprise}`);
			}
			localStorage.setItem("userID", decodedToken.id);
			if (!isSafari && !isMobileSafari) {
				CometChat.createUser(user, COMETCHAT_CONSTANTS.AUTH_KEY).then(
					(user) => {
						CometChat.login(UID, apiKey).then(
							(User) => {
								setSaveData(2);
							},
							(error) => {
								setLoading(false);
								notification["error"]({
									message: "Ha ocurrido un error",
								});
							}
						);
					},
					(error) => {
						if (error.details.uid[0] === "The uid has already been taken.") {
							CometChat.updateUser(user, COMETCHAT_CONSTANTS.AUTH_KEY).then(
								(user) => {
									CometChat.login(UID, apiKey).then(
										(User) => {
											setSaveData(2);
										},
										(error) => {
											setLoading(false);
											notification["error"]({
												message: "Ha ocurrido un error",
											});
										}
									);
								},
								(error) => {
									CometChat.login(UID, apiKey).then(
										(User) => {
											setSaveData(2);
										},
										(error) => {
											setLoading(false);
											notification["error"]({
												message: "Ha ocurrido un error",
											});
										}
									);
								}
							);
						} else {
							setLoading(false);
							notification["error"]({
								message: "Ocurrió un error",
							});
						}
					}
				);
			} else {
				setSaveData(2);
			}
		}
	};

	return (
		<form
			className="formLogin"
			onChange={changeForm}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				signIn();
			}}
		>
			<div className="campo">
				<input type="email" id="email" placeholder="Correo electrónico EY" name="email" value={inputs.email} onChange={inputValidation} />
				{/* <label>Email</label> */}
			</div>
			<div className="campobutton">
				<ColorButton variant="contained" color="primary" className="btn">
					<button style={{ background: "transparent", border: "transparent", cursor: "pointer" }}>Ingresar</button>
				</ColorButton>
			</div>
			{/* <a onClick={() => setSaveData(1)} className="enlace">
				Aún no estoy registrado
			</a> */}
		</form>
	);
};

export default LoginForm;
