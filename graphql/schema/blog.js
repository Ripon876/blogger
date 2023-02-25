const User = require("../../models/user");
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID, 
  
} = require("graphql");

module.exports = {
	BlogType: new GraphQLObjectType({
		name: "Blog",
		fields: () => ({
			_id: { type: GraphQLID },
			title: { type: GraphQLString },
			content: { type: GraphQLString },
			author: {
				type: UserType,
				resolve: async (blog, args) => {
					let user = await User.findOne({ _id: blog.author });
					return user;
				},
			},
			creation_date: { type: GraphQLString },
		}),
	}),
};
