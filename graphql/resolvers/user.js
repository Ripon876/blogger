const User = require("../../models/user");

module.exports = {
	users: async (args) => {
		try {
			users = await User.find({});
			return users;
		} catch (err) {
			console.log(err);
		}
	},
};
