const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	from: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	message: {
		type: String,
		required: true,
	},
	thread: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Thread",
	},
});

module.exports = mongoose.model("Message", messageSchema);
