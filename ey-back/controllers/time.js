const moment = require("moment");
require("moment/locale/es");

function getTime(req, res) {
	const time = moment().format();
	const eventTime = new Date(2021, 6, 24, 11, 0, 0);
	res.status(200).send({ ok: true, time, eventTime });
}

module.exports = {
	getTime,
};
