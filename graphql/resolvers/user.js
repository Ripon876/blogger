const User = require("../../models/user");

module.exports = async (args) => {
	try {
		users = await User.find({});
		return users;
	} catch (err) {
		console.log(err);
	}
};
