const express = require("express");
const PaymentController = require("../controllers/payment");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.post("/make-pay", PaymentController.makePay);
api.post("/catch-payment", PaymentController.catchPay);
api.post("/sign-in-pago-facil", PaymentController.signInPagoFacil);
api.get("/get-payments", [md_auth.ensureAuth], PaymentController.getPayments);

module.exports = api;
