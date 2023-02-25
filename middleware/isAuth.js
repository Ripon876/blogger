const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	// console.log(authHeader)
	// console.log("auth middleware running");

	if (!token) {
		req.isAuth = false;
		return next();
	}

	try {
		let user = jwt.verify(token, process.env.JWT_SECRET);
		req.isAuth = true;
		req.user = user;
		return next();
	} catch (err) {
		console.log(err);
		req.isAuth = false;
		return next();
	}
};
