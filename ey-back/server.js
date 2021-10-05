const mongoose = require("mongoose");
const cron = require("node-cron");
const moment = require("moment");
require("moment/locale/es");

const app = require("./app");
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");
const RealTime = require("./models/realTime");
const PagoFacil = require("./controllers/payment");

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

cron.schedule("0 */8 * * *", function () {
	PagoFacil.signInPagoFacil();
});

let agendaStatus = false;
let users = [];
let agendaArray = [];
let peak = {
	time: null,
	count: 0,
};

io.on("connection", (socket) => {
	socket.on("NEW_USER", (user) => {
		try {
			const newUser = {
				id: socket.id,
				userId: user.userId,
				name: user.name,
				lastname: user.lastname,
				email: user.email,
				phone: user.phone,
				enterprise: user.enterprise,
				position: user.position,
				sector: user.sector,
				route: user.route,
				flagIcon: user.flagIcon,
				city: user.city,
				postalCode: user.postalCode,
				continent: user.continent,
				continentCode: user.continentCode,
				country: user.country,
				countryIsoCode: user.countryIsoCode,
				locationLatLong: user.locationLatLong,
				accuracyRadius: user.accuracyRadius,
				timeZone: user.timeZone,
				region: user.region,
				regionIsoCode: user.regionIsoCode,
				ipAddress: user.ipAddress,
				ipType: user.ipType,
				isp: user.isp,
				conectionType: user.conectionType,
				navigatorName: user.navigatorName,
				operatingSystem: user.operatingSystem,
				conectionTime: new Date(moment().subtract(3, "hours").format()).getTime(),
				conectionTimeEnd: null,
			};
			users.push(newUser);
			console.log(newUser);
			io.emit("USER", newUser);
			io.emit("UPDATE_USER_LIST", users);
			if (users.length > peak.count) {
				peak.count = users.length;
				peak.time = moment().subtract(3, "hours").format("LLL");
				io.emit("PEAK", peak);
			}
			if (agendaStatus) {
				const index = agendaArray.findIndex((element) => element.id === newUser.id);
				if (index < 0) {
					agendaArray.push(newUser);
				}
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("UPDATE_ROUTE", (user) => {
		try {
			const index = users.findIndex((element) => element.id === socket.id);
			if (index >= 0) {
				users[index].route = user.route;
				io.emit("UPDATE_USER_LIST", users);
			}
			if (agendaStatus) {
				const index2 = agendaArray.findIndex((element) => element.id === socket.id);
				if (index2 >= 0) {
					agendaArray[index2].route = user.route;
				}
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("GET_USERS", () => {
		io.emit("UPDATE_USER_LIST", users);
	});

	socket.on("GET_PEAK", () => {
		io.emit("PEAK", peak);
	});

	socket.on("disconnect", () => {
		try {
			const index = users.findIndex((element) => element.id === socket.id);
			if (index >= 0) {
				const realTime = new RealTime();
				realTime.user = users[index].userId;
				realTime.flagIcon = users[index].flagIcon;
				realTime.city = users[index].city;
				realTime.postalCode = users[index].postalCode;
				realTime.continent = users[index].continent;
				realTime.continentCode = users[index].continentCode;
				realTime.country = users[index].country;
				realTime.countryIsoCode = users[index].countryIsoCode;
				realTime.locationLatLong = users[index].locationLatLong;
				realTime.accuracyRadius = users[index].accuracyRadius;
				realTime.timeZone = users[index].timeZone;
				realTime.region = users[index].region;
				realTime.regionIsoCode = users[index].regionIsoCode;
				realTime.ipAddress = users[index].ipAddress;
				realTime.ipType = users[index].ipType;
				realTime.isp = users[index].isp;
				realTime.conectionType = users[index].conectionType;
				realTime.navigatorName = users[index].navigatorName;
				realTime.operatingSystem = users[index].operatingSystem;
				realTime.conectionTime = users[index].conectionTime;
				realTime.conectionTimeEnd = new Date(moment().subtract(3, "hours").format()).getTime();
				realTime.save((err, realTimeStored) => {});
				users = users.filter((u) => u.id !== socket.id);
				io.emit("UPDATE_USER_LIST", users);
				socket.removeAllListeners();
			}
			if (agendaStatus) {
				const index2 = agendaArray.findIndex((element) => element.id === socket.id);
				if (index2 >= 0) {
					agendaArray[index2].conectionTimeEnd = new Date(moment().subtract(3, "hours").format()).getTime();
				}
			}
		} catch (error) {
			console.log(error);
		}
	});
});

const port = process.env.PORT || 8080;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/upwebinar`, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
	if (err) {
		throw err;
	} else {
		server.listen(port, function () {
			console.log("--------------------------------");
			console.log("|          Up Webinar          |");
			console.log("--------------------------------");
			console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}`);
		});
	}
});
