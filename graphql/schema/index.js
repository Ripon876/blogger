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
	getUsers,
	createUser,
	loginUser,
	getBlogs,
	createBlog,
	getComments,
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
			resolve: async (user, args) => {
				try {
					let blogs = await Blog.find({ _id: { $in: user.blogs } });
					return blogs;
				} catch (err) {
					throw err;
				}
			},
		},
		comments: {
			type: new GraphQLList(CommentType),
			resolve: async (user, args) => {
				try {
					let comments = await Comment.find({
						_id: { $in: user.comments },
					});
					return comments;
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
		comments: {
			type: new GraphQLList(CommentType),
			resolve: async (blog, args) => {
				try {
					let comments = await Comment.find({
						_id: { $in: blog.comments },
					});
					return comments;
				} catch (err) {
					throw err;
				}
			},
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
			resolve: async (comment, args) => {
				try {
					let blog = await Blog.findOne({ _id: comment.blog });
					return blog;
				} catch (err) {
					throw err;
				}
			},
		},
		author: {
			type: UserType,
			resolve: async (comment, args) => {
				try {
					let user = await User.findOne({ _id: comment.author });
					return user;
				} catch (err) {
					throw err;
				}
			},
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
		blogs: {
			type: new GraphQLList(BlogType),
			resolve: getBlogs,
		},
		comments: {
			type: new GraphQLList(CommentType),
			resolve: getComments,
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
