/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { notification, Form, Button as ButtonAntd, Select } from "antd";

import { signUpApi } from "../../../api/user";
import { emailValidation, minLengthValidation } from "../../../utils/formValidation";

import "./RegisterForm.scss";

const { Option } = Select;

const RegisterForm = (props) => {
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

	const { setLoading, setSaveData } = props;

	function onChangeCountry(value) {
		setInputs({
			...inputs,
			sector: value,
		});
	}

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

	const SignUp = async (e) => {
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
			const result = await signUpApi(inputs);
			if (!result.ok) {
				notification["error"]({
					message: result.message,
				});
				setLoading(false);
			} else {
				localStorage.setItem("userID", result.userId);
				setSaveData(2);
			}
		}
	};

	return (
		<Form onChange={changeForm} onFinish={SignUp}>
			<div className="campo">
				<div className="mitad">
					<input id="name" type="text" name="name" placeholder="Nombre" value={inputs.name} onChange={inputValidation} />
					<label>Nombre</label>
				</div>
				<div className="mitad">
					<input id="lastname" name="lastname" type="text" placeholder="Apellidos" value={inputs.lastname} onChange={inputValidation} />
					<label>Apellidos</label>
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
					<input type="text" id="position" placeholder="Cargo" name="position" value={inputs.position} onChange={inputValidation} />
					<label>Cargo</label>
				</div>
			</div>
			<div className="campo">
				<div className="mitad">
					<input type="email" id="email" placeholder="Correo electrónico" name="email" value={inputs.email} onChange={inputValidation} />
					<label>Correo electrónico</label>
				</div>
				<div className="mitad">
					<input type="text" id="phone" name="phone" placeholder="Teléfono (+56)" value={inputs.phone} onChange={inputValidation} />
					<label>Teléfono (+56)</label>
				</div>
			</div>
			<div className="campo">
				<Select
					showSearch
					style={{ width: "100%", marginBottom: "20px", height: "48px" }}
					placeholder="Sector al que perteneces"
					optionFilterProp="children"
					onChange={onChangeCountry}
					filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				>
					<Option value="Sector Público">Sector Público</Option>
					<Option value="Proveedor Industria Tecnológica">Proveedor Industria Tecnológica</Option>
					<Option value="Academia">Academia</Option>
					<Option value="Otro">Otro</Option>
				</Select>
			</div>
			<div className="campo">
				<div className="mitad">
					<span className="more-info">
						Ya estoy registrado. <a onClick={() => setSaveData(1)}>Ingresa aquí</a>
					</span>
				</div>
				<div className="mitad">
					<ButtonAntd htmlType="submit" className="btn">
						<p>Registrarse</p>
					</ButtonAntd>
				</div>
			</div>
		</Form>
	);
};

export default RegisterForm;
