const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	comment: {
		type: String,
		required: true,
	},
	blog: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Blog",
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	creation_date: {
		type: String,
		required: true,
	},
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
