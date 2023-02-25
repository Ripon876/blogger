const User = require("../../models/user");
const Blog = require("../../models/blog");

module.exports = {
	getBlogs: async () => {
		try {
			let blogs = await Blog.find({});
			return blogs;
		} catch (err) {
			throw err;
		}
	},
	getUserBlogs: async (user, args) => {
		try {
			let blogs = await Blog.find({ _id: { $in: user.blogs } });
			return blogs;
		} catch (err) {
			throw err;
		}
	},
	createBlog: async (parent, args, req) => {
		console.log(req.user);
		try {
			let blog = await new Blog({
				title: args.title,
				content: args.content,
				author: req.user.id,
				// comments: [],
				creation_date: new Date().toUTCString(),
			});
			let user = await User.findOne({ _id: req.user.id });
			user.blogs.push(blog._id);

			await blog.save();
			await user.save();
			return true;
		} catch (err) {
			throw err;
		}
	},
};

const author = (id) => {};
