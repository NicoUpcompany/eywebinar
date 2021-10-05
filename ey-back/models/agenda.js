const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const agendaSchema = new Schema({
	time: { type: String, default: "0" },
	hour: { type: String, default: "0" },
	day: { type: String, default: "0" },
	description: { type: String, default: "" },
	link: { type: String, default: "" },
	active: { type: Boolean, default: true },
	user: { type: Schema.Types.ObjectId, ref: "User", default: null },
	owner: { type: Schema.Types.ObjectId, ref: "User", default: null },
});

module.exports = mongoose.model("Agenda", agendaSchema);
