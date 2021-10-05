const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = Schema({
	paymentId: { type: String, unique: true, required: true },
	user: { type: Schema.Types.ObjectId, ref: "User", default: null },
	amount: { type: Number, required: true },
	status: { type: String, default: "PENDIENTE" },
});

module.exports = mongoose.model("Payment", paymentSchema);
