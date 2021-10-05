const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "asDHYdsvCRGSCdHealthTechhgbvASVBGFDcszxbVCAvds";

exports.createAccessToken = function (user) {
	const payload = {
		id: user._id,
		name: user.name,
		lastname: user.lastname,
		email: user.email,
		phone: user.phone,
		enterprise: user.enterprise,
		position: user.position,
		sector: user.sector,
		role: user.role,
		createToken: moment().unix(),
		exp: moment().add(10, "hours").unix(),
	};

	return jwt.encode(payload, SECRET_KEY);
};

exports.createRefreshToken = function (user) {
	const payload = {
		id: user._id,
		name: user.name,
		lastname: user.lastname,
		email: user.email,
		phone: user.phone,
		enterprise: user.enterprise,
		position: user.position,
		sector: user.sector,
		role: user.role,
		exp: moment().add(30, "days").unix(),
	};

	return jwt.encode(payload, SECRET_KEY);
};

exports.decodedToken = function (token) {
	return jwt.decode(token, SECRET_KEY, true);
};
