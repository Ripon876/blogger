const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Blog = require("../../models/blog");
const Comment = require("../../models/comment");
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
	getUser,
	getUserById,
	getUsers,
	createUser,
	loginUser,
	getBlog,
	getBlogById,
	getBlogs,
	getUserBlogs,
	createBlog,
	getCommentById,
	getComments,
	getBUComments,
	createComment,
} = require("../resolvers");

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		_id: { type: GraphQLID },
		username: { type: GraphQLString },
		password: { type: GraphQLString },
		blogs: {
			type: new GraphQLList(BlogType),
			resolve: getUserBlogs,
		},
		comments: {
			type: new GraphQLList(CommentType),
			resolve: getBUComments,
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
			resolve: getUser,
		},
		comments: {
			type: new GraphQLList(CommentType),
			resolve: getBUComments,
		},
		creation_date: { type: GraphQLString },
	}),
});

const CommentType = new GraphQLObjectType({
	name: "Comment",
	fields: {
		_id: { type: GraphQLID },
		comment: { type: GraphQLString },
		blog: {
			type: BlogType,
			resolve: getBlog,
		},
		author: {
			type: UserType,
			resolve: getUser,
		},
		creation_date: { type: GraphQLString },
	},
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
		blog: {
			type: BlogType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: getBlogById,
		},
		blogs: {
			type: new GraphQLList(BlogType),
			resolve: getBlogs,
		},
		comment: {
			type: CommentType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: getCommentById,
		},
		comments: {
			type: new GraphQLList(CommentType),
			resolve: getComments,
		},
		user: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: getUserById,
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
			type: BlogType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				content: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: createBlog,
		},
		createComment: {
			type: CommentType,
			args: {
				comment: { type: new GraphQLNonNull(GraphQLString) },
				blog_id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: createComment,
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});
