require("dotenv").config();
const nodemailer = require("nodemailer");
const moment = require("moment");
require("moment/locale/es");

const jwt = require("../services/jwt");
const User = require("../models/user");

const upEmail = process.env.EMAIL;
const upPassword = process.env.PASSWORD_EMAIL;

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: upEmail,
		pass: upPassword,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

function signUp(req, res) {
	const { name, lastname, email, phone, enterprise, position, sector } = req.body;

	const signUpTime = moment().subtract(3, "hours").format("LLL");

	const user = new User();
	user.name = name;
	user.lastname = lastname;
	user.email = email.toString().toLowerCase();
	user.phone = phone;
	user.enterprise = enterprise;
	user.position = position;
	user.sector = sector;
	user.signUpTime = signUpTime;
	user.save((err, userStored) => {
		if (err) {
            console.log(err)
			res.status(400).send({ ok: false, message: "El correo ya fue registrado" });
		} else {
			if (!userStored) {
				res.status(500).send({ ok: false, message: "Error al crear el usuario" });
			} else {
				const mailOptions = {
					from: `Up Webinar <${upEmail}>`,
					to: userStored.email,
					subject: "Gracias por registrarte al evento de Up Webinar",
					text: "Gracias por registrarte al evento de Up Webinar",
					html: `Gracias por registrarte al evento de Up Webinar`,
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						res.status(500).send({ ok: false, message: "Error del servidor" });
					} else {
						res.status(200).send({ ok: true, userId: userStored.id });
					}
				});
			}
		}
	});
}

function signIn(req, res) {
	let { email } = req.body;

	email = email.toString().toLowerCase();

	const signInTime = moment().subtract(3, "hours").format("LLL");

	User.findOne({ email }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({ ok: false, message: "Usuario no encontrado" });
			} else {
				if (!userStored.active) {
					res.status(403).send({ ok: false, message: "Ingreso no permitido" });
				} else {
					userStored.signInTime = signInTime;
					User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
						if (err) {
							res.status(500).send({ ok: false, message: "Error del servidor" });
						} else {
							if (!userUpdate) {
								res.status(404).send({ ok: false, message: "No se ha encontrado el usuario" });
							} else {
								res.status(200).send({
									ok: true,
									accessToken: jwt.createAccessToken(userUpdate),
									refreshToken: jwt.createRefreshToken(userUpdate),
								});
							}
						}
					});
				}
			}
		}
	});
}

function signInAdmin(req, res) {
	const { email } = req.body;

	const signInTime = moment().subtract(3, "hours").format("LLL");

	User.findOne({ email }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({ ok: false, message: "Usuario no encontrado" });
			} else {
				if (userStored.role !== "Admin") {
					res.status(403).send({ ok: false, message: "No eres administrador" });
				} else {
					userStored.signInTime = signInTime;
					User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
						if (err) {
							res.status(500).send({ ok: false, message: "Error del servidor" });
						} else {
							if (!userUpdate) {
								res.status(404).send({ ok: false, message: "No se ha encontrado el usuario" });
							} else {
								res.status(200).send({
									ok: true,
									accessToken: jwt.createAccessToken(userStored),
									refreshToken: jwt.createRefreshToken(userStored),
								});
							}
						}
					});
				}
			}
		}
	});
}

function getUsers(req, res) {
	User.find({ active: { $ne: false } }).then((users) => {
		if (!users) {
			res.status(404).send({ ok: false, message: "No se ha encontrado ningún usuario" });
		} else {
			res.status(200).send({ ok: true, users });
		}
	});
}

function updateWaitingRoomTime(req, res) {
	const { email } = req.body;

	const waitingRoomTime = moment().subtract(3, "hours").format("LLL");

	User.findOne({ email }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({ ok: false, message: "Usuario no encontrado" });
			} else {
				userStored.waitingRoomTime = waitingRoomTime;
				User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
					if (err) {
						res.status(500).send({ ok: false, message: "Error del servidor" });
					} else {
						if (!userUpdate) {
							res.status(404).send({ ok: false, message: "No se ha encontrado el usuario" });
						} else {
							res.status(200).send({
								ok: true,
								message: "Usuario actualizado",
							});
						}
					}
				});
			}
		}
	});
}

function updateStreamTime(req, res) {
	const { email } = req.body;

	const streamTime = moment().subtract(3, "hours").format("LLL");

	User.findOne({ email }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({ ok: false, message: "Usuario no encontrado" });
			} else {
				userStored.streamTime = streamTime;
				User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
					if (err) {
						res.status(500).send({ ok: false, message: "Error del servidor" });
					} else {
						if (!userUpdate) {
							res.status(404).send({ ok: false, message: "No se ha encontrado el usuario" });
						} else {
							res.status(200).send({
								ok: true,
								message: "Usuario actualizado",
							});
						}
					}
				});
			}
		}
	});
}

function changeRole(req, res) {
	const { id } = req.params;

	User.findById({ _id: id }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({ ok: false, message: "Usuario no encontrado" });
			} else {
				if (userStored.role === "Admin") {
					userStored.role = "User";
				} else {
					userStored.role = "Admin";
				}
				User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
					if (err) {
						res.status(500).send({ ok: false, message: "Error del servidor" });
					} else {
						if (!userUpdate) {
							res.status(404).send({ ok: false, message: "No se ha encontrado el usuario" });
						} else {
							res.status(200).send({
								ok: true,
								message: "Usuario actualizado",
							});
						}
					}
				});
			}
		}
	});
}

function updateUser(req, res) {
	let userData = req.body;
	const params = req.params;

	User.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
		if (err) {
			res.status(500).send({ message: "Error del servidor" });
		} else {
			if (!userUpdate) {
				res.status(404).send({ message: "No se ha encontrado el usuario" });
			} else {
				res.status(200).send({ message: "Usuario actualizado" });
			}
		}
	});
}

function deleteUser(req, res) {
	const { id } = req.params;

	User.findById({ _id: id }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({ ok: false, message: "Usuario no encontrado" });
			} else {
				userStored.active = false;
				User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
					if (err) {
						res.status(500).send({ ok: false, message: "Error del servidor" });
					} else {
						if (!userUpdate) {
							res.status(404).send({ ok: false, message: "No se ha encontrado el usuario" });
						} else {
							res.status(200).send({
								ok: true,
								message: "Usuario eliminado",
							});
						}
					}
				});
			}
		}
	});
}

function searchById(req, res) {
	const { id } = req.params;

	User.findById({ _id: id }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({ ok: false, message: "Usuario no encontrado" });
			} else {
				res.status(200).send({
					ok: true,
					user: userStored,
				});
			}
		}
	});
}

module.exports = {
	signUp,
	signIn,
	signInAdmin,
	getUsers,
	updateWaitingRoomTime,
	updateStreamTime,
	changeRole,
	updateUser,
	deleteUser,
	searchById,
};
