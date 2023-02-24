const bcrypt = require("bcrypt");
const User = require("../../models/user");

module.exports = {
	users: async () => {
		try {
			users = await User.find({});
			return users;
		} catch (err) {
			console.log(err);
		}
	},
	createUser: async (args) => {
		try {
			let hashedPWD = await bcrypt.hash(args.input.password, 10);
			let user = await new User({
				username: args.input.username,
				password: hashedPWD,
			});
			await user.save();
			return user;
		} catch (err) {
			throw err;
		}
	},
};
