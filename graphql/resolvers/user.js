const bcrypt = require("bcrypt");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
	getUser: async (blog, args) => {
		try {
			let user = await User.findOne({ _id: blog.author });
			return user;
		} catch (err) {
			throw err;
		}
	},
	getUsers: async () => {
		try {
			let users = await User.find({});
			return users;
		} catch (err) {
			throw err;
		}
	},
	createUser: async (parent, args, context) => {
		// console.log("parent : ", parent);
		// console.log("args : ", args);
		// console.log("context : ", context);

		try {
			let u = await User.findOne({ username: args.username });

			if (!u) {
				let hashedPWD = await bcrypt.hash(args.password, 10);
				let user = await new User({
					username: args.username,
					password: hashedPWD,
				});
				await user.save();
				return user;
			} else {
				throw new Error("username already in use");
			}
		} catch (err) {
			throw err;
		}
	},
	loginUser: async (parent, args) => {
		try {
			let user = await User.findOne({ username: args.username });

			if (!user) {
				throw new Error("User doesn't exits");
			}

			let isMatched = await bcrypt.compare(args.password, user.password);
			if (!isMatched) {
				throw new Error("Password didn't matched");
			}

			let token = await jwt.sign(
				{
					id: user._id,
					username: user.username,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: "1h",
				}
			);

			return {
				id: user._id,
				token,
			};
		} catch (err) {
			throw err;
		}
	},
};
