const userResolvers = require("./user");
const blogResolvers = require("./blog");

module.exports = {
	...userResolvers,
	...blogResolvers,
};
