const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const resolvers = require("./resolvers");

module.exports = async (app) => {
	console.log("connenting with api");
	app.use(
		"/graphql",
		graphqlHTTP({
			schema: schema,
			graphiql: true,
			rootValue: resolvers,
		})
	);
	return app;
};
