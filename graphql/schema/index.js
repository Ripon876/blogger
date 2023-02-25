const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Blog = require("../../models/blog");
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLNonNull,
	GraphQLList,
} = require("graphql");

const {
	getUsers,
	createUser,
	loginUser,
	getBlogs,
	createBlog,
} = require("../resolvers");

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		_id: { type: GraphQLID },
		username: { type: GraphQLString },
		password: { type: GraphQLString },
		blogs: {
			type: new GraphQLList(BlogType),
			resolve: async (user, args) => {
				try {
					let blogs = await Blog.find({ _id: { $in: user.blogs } });
					return blogs;
				} catch (err) {
					throw err;
				}
			},
		},
	}),
});

const BlogType = new GraphQLObjectType({
	name: "Blog",
	fields: () => ({
		_id: { type: GraphQLID },
		title: { type: GraphQLString },
		content: { type: GraphQLString },
		author: {
			type: UserType,
			resolve: async (blog, args) => {
				try {
					let user = await User.findOne({ _id: blog.author });
					return user;
				} catch (err) {
					throw err;
				}
			},
		},
		creation_date: { type: GraphQLString },
	}),
});

const TokenType = new GraphQLObjectType({
	name: "Token",
	fields: {
		id: { type: GraphQLID },
		token: { type: GraphQLString },
	},
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: () => ({
		blogs: {
			type: new GraphQLList(BlogType),
			resolve: getBlogs,
		},
		users: {
			type: new GraphQLList(UserType),
			resolve: getUsers,
		},
		login: {
			type: TokenType,
			args: {
				username: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: loginUser,
		},
	}),
});

const RootMutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		createUser: {
			type: UserType,
			args: {
				username: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: createUser,
		},
		createBlog: {
			type: GraphQLBoolean,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				content: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: createBlog,
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});
