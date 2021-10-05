const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validRoles = {
	values: ["Admin", "User"],
	message: "{VALUE} no es un rol permitido",
};

const userSchema = Schema({
	name: { type: String, default: "" },
	lastname: { type: String, default: "" },
	email: { type: String, required: true, unique: false },
	enterprise: { type: String, default: "" },
	position: { type: String, default: "" },
	phone: { type: String, default: "" },
	sector: { type: String, default: "" },
	role: { type: String, default: "User", enum: validRoles },
	signUpTime: { type: String, default: "0" },
	signInTime: { type: String, default: "0" },
	waitingRoomTime: { type: String, default: "0" },
	streamTime: { type: String, default: "0" },
	active: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", userSchema);
