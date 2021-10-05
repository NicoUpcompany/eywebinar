const express = require("express");
const MailingController = require("../controllers/mailing");

const api = express.Router();

api.get("/mailing-image/:image", MailingController.getImage);

module.exports = api;
