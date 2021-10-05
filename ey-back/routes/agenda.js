const express = require("express");
const AgendaController = require("../controllers/agenda");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.put("/agenda/:id", [md_auth.ensureAuth], AgendaController.scheduling);
api.post(
	"/agenda",
	[md_auth.ensureAuth],
	AgendaController.getAgendaAvailableByDay
);
api.post(
	"/agenda-owner",
	[md_auth.ensureAuth],
	AgendaController.getAgendaByOwner
);
api.get("/agenda", [md_auth.ensureAuth], AgendaController.getAgendaAll);
api.post("/importXlsx", AgendaController.xlsxToJson);
api.put(
	"/change-agenda-status/:id",
	[md_auth.ensureAuth],
	AgendaController.changeAgendaStatus
);

module.exports = api;
