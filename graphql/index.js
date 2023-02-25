const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

module.exports = async (app) => {
	console.log("connenting with api");

	app.use(
		"/graphql",
		graphqlHTTP({
			schema: schema,
			graphiql: true,
		})
	);
	return app;
};
