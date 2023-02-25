const userResolvers = require("./user");
const blogResolvers = require("./blog");
const commentResolvers = require("./comment");

module.exports = {
	...userResolvers,
	...blogResolvers,
	...commentResolvers,
};
