const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/event");
const realTimeRoutes = require("./routes/realTime");
const questionRoutes = require("./routes/question");
const timeRoutes = require("./routes/time");
const agendaRoutes = require("./routes/agenda");
const userAgendaRoutes = require("./routes/userAgenda");
const mailingRoutes = require("./routes/mailing");
const paymentRoutes = require("./routes/payment");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
	);
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
	next();
});

app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, eventRoutes);
app.use(`/api/${API_VERSION}`, realTimeRoutes);
app.use(`/api/${API_VERSION}`, questionRoutes);
app.use(`/api/${API_VERSION}`, timeRoutes);
app.use(`/api/${API_VERSION}`, agendaRoutes);
app.use(`/api/${API_VERSION}`, userAgendaRoutes);
app.use(`/api/${API_VERSION}`, mailingRoutes);
app.use(`/api/${API_VERSION}`, paymentRoutes);

module.exports = app;
