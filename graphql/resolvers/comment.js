const User = require("../../models/user");
const Blog = require("../../models/blog");
const Comment = require("../../models/comment");

module.exports = {
	getComments: async () => {
		try {
			let comments = await Comment.find({});
			return comments;
		} catch (err) {
			throw err;
		}
	},
	getBUComments: async (bu, args) => {
		try {
			let comments = await Comment.find({
				_id: { $in: bu.comments },
			});
			return comments;
		} catch (err) {
			throw err;
		}
	},
	createComment: async (parent, args, req) => {
		if (!req.isAuth) {
			throw new Error("Unauthenticated , login and try again");
		}
		try {
			let comment = await new Comment({
				comment: args.comment,
				blog: args.blog_id,
				author: req.user.id,
				creation_date: new Date().toUTCString(),
			});
			let blog = await Blog.findOne({ _id: args.blog_id });
			blog.comments.push(comment._id);

			let user = await User.findOne({ _id: req.user.id });
			user.comments.push(comment._id);

			await comment.save();
			await blog.save();
			await user.save();

			return comment;
		} catch (err) {
			throw err;
		}
	},
};
