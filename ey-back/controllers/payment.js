require("dotenv").config();
const ApiPagoFacil = require("@pagofacil/api_pago_facil");
const User = require("../models/user");
const Payment = require("../models/payment");
const Signature = require("@pagofacil/sdk-apis-javascript-signature");
const moment = require("moment");
require("moment/locale/es");
// const nodemailer = require("nodemailer");

const trx = new ApiPagoFacil.TrxsApi();

const tokenService = process.env.TOKEN_SERVICE;
const tokenSecret = process.env.TOKEN_SECRET;

const uuid = require("uuid/v4");

function signInPagoFacil() {
	const username = process.env.PF_USERNAME;
	const password = process.env.PF_PASSWORD;

	const loginBody = new ApiPagoFacil.LoginBody(username, password);

	const api = new ApiPagoFacil.AuthApi();
	const opts = {
		loginBody: loginBody,
	};
	const callback = function (error, data, response) {
		if (error) {
			console.error(error);
		} else {
			console.log("API called successfully. Returned data: ");
			const loginResponse = data;
			const dataLoginResponse = loginResponse.data;
			const access_token_jwt = dataLoginResponse.access_token_jwt;

			console.log("LOGIN RESPONSE", loginResponse.message, dataLoginResponse, access_token_jwt);
		}
	};
	api.usersLoginPost(opts, callback);
}

function makePay(req, res) {
	const { name, lastname, email, phone, enterprise, position, sector, value } = req.body;

	const signUpTime = moment().format("LLL");

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
			res.status(500).send({ ok: false, message: "Error de servidor 0001" });
		} else {
			if (!userStored) {
				res.status(500).send({ ok: false, message: "Error de servidor 0002" });
			} else {
				const postBodyTrx = {
					x_account_id: tokenService,
					x_amount: parseInt(value),
					x_currency: "CLP",
					x_reference: uuid(),
					x_customer_email: userStored.email,
					x_url_complete: "http://localhost:8080/api/v1/catch-payment",
					x_url_cancel: "http://localhost:8080/api/v1/catch-payment",
					x_url_callback: "http://localhost:8080/api/v1/catch-payment",
					x_shop_country: "CL",
					x_session_id: uuid(),
				};

				const x_signature = Signature.signPayload(postBodyTrx, tokenSecret);
				postBodyTrx.x_signature = x_signature;
				const optsTrx = {
					inlineObject: postBodyTrx,
				};

				trx.trxsPost(optsTrx, (error, data, response) => {
					if (error) {
						res.status(error.status).send({ status: error.status, message: error.response.body.message });
					} else {
						const payment = new Payment();
						payment.paymentId = postBodyTrx.x_reference;
						payment.user = userStored.id;
						payment.amount = parseInt(value);
						payment.save((err, paymentStored) => {
							if (err) {
								res.status(500).send({ ok: false, message: "Error de servidor 0003" });
							} else {
								if (!paymentStored) {
									res.status(500).send({ ok: false, message: "Error de servidor 0004" });
								} else {
									res.status(200).send({ ok: true, response: response.body.data });
								}
							}
						});
					}
				});
			}
		}
	});
}

function catchPay(req, res) {
	const resp = req.body;

	// var upEmail = process.env.EMAIL;
	// var upPassword = process.env.PASSWORD_EMAIL;

	// var transporter = nodemailer.createTransport({
	//     service: 'Gmail',
	//     auth: {
	//         user: upEmail,
	//         pass: upPassword
	//     },
	//     tls: {
	//         rejectUnauthorized: false
	//     }
	// });

	if (resp.x_result !== "completed") {
		res.redirect("http://localhost:3000/confirmacion");
	} else {
		Payment.findOne({ paymentId: resp.x_reference }, (err, paymentStored) => {
			if (err) {
				res.status(500).send({ ok: false, message: "Error de servidor 005" });
			} else {
				if (!paymentStored) {
					res.status(500).send({ ok: false, message: "Error de servidor 0006" });
				} else {
					if (paymentStored.status === "PENDIENTE") {
						paymentStored.status = "COMPLETADO";
						Payment.findByIdAndUpdate({ _id: paymentStored.id }, paymentStored, (err, paymentUpdate) => {
							if (err) {
								res.status(404).send({ ok: false, message: "Error de servidor 0007" });
							} else {
								if (!paymentUpdate) {
									res.status(500).send({ ok: false, message: "Error del servidor 0008" });
								} else {
									User.findById({ _id: paymentStored.user }, (err, userStored) => {
										if (err) {
											res.status(404).send({ ok: false, message: "Error de servidor 0009" });
										} else {
											if (!userStored) {
												res.status(500).send({ ok: false, message: "Error del servidor 0010" });
											} else {
												res.redirect("http://localhost:3000/confirmacion");
												// var mailOptions = {
												//     from: upEmail,
												//     to: userStored.email,
												//     subject: 'Transacción exitosa',
												//     text: 'Transacción exitosa',
												//     html: ``
												// };
												// transporter.sendMail(mailOptions, function(error, info){
												//     if(error){
												//         res.status(500).send({message: "Error del servidor 0011"});
												//     } else {
												//         res.redirect('https://hdc.upwebinar.cl/donacion-exito');
												//     }
												// });
											}
										}
									});
								}
							}
						});
					} else {
						res.redirect("http://localhost:3000/confirmacion");
					}
				}
			}
		});
	}
}

function getPayments(req, res) {
	Payment.find().then((payments) => {
		if (!payments) {
			res.status(404).send({ ok: false, payments: [] });
		} else {
			res.status(200).send({ ok: true, payments });
		}
	});
}

module.exports = {
	signInPagoFacil,
	makePay,
	catchPay,
	getPayments,
};
