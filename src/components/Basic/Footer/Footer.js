/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import logo from "../../../assets/images/logo-wtng-rm.png";
import logo2 from "../../../assets/img/up3.svg";

import "./Footer.scss";

const Footer = (props) => {
	const { setSaveData } = props;

	return (
		<footer>
			<img src={logo} alt="logo" style={{ maxWidth: "100px" }} />
			<a onClick={() => setSaveData(2)}>
				Powered By
				<img src={logo2} alt="logo2" />
			</a>
		</footer>
	);
};

export default Footer;
