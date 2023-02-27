const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Blog = require("../../models/blog");
const Comment = require("../../models/comment");
const Thread = require("../../models/thread");
const Message = require("../../models/message");
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
	getMFUser,
	getMTUser,
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
		threads: {
			type: new GraphQLList(ThreadType),
			resolve: async (parent) => {
				try {
					let threads = await Thread.find({
						_id: { $in: parent.threads },
					});
					return threads;
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

const MessageType = new GraphQLObjectType({
	name: "Message",
	fields: () => ({
		from: {
			type: UserType,
			resolve: getMFUser,
		},
		to: {
			type: UserType,
			resolve: getMTUser,
		},
		message: { type: GraphQLString },
		thread: {
			type: ThreadType,
			resolve: async (parent, args) => {
				try {
					let thread = await Thread.findOne({ _id: parent.thread });
					return thread;
				} catch (err) {
					throw err;
				}
			},
		},
	}),
});

const ThreadType = new GraphQLObjectType({
	name: "Thread",
	fields: {
		_id: { type: GraphQLID },
		users: {
			type: new GraphQLList(UserType),
			resolve: async (parent, args) => {
				try {
					let users = await User.find({ _id: { $in: parent.users } });
					return users;
				} catch (err) {
					throw err;
				}
			},
		},
		messages: {
			type: new GraphQLList(MessageType),
			resolve: async (parent, args) => {
				try {
					let messages = await Message.find({
						_id: { $in: parent.messages },
					});
					return messages;
				} catch (err) {
					throw err;
				}
			},
		},
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
		threads: {
			type: new GraphQLList(ThreadType),
			resolve: async () => {
				try {
					let threads = await Thread.find({});
					return threads;
				} catch (err) {
					throw err;
				}
			},
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
		getThread: {
			type: ThreadType,
			args: {
				users: { type: new GraphQLList(GraphQLID) },
			},
			resolve: async (parent, args, req) => {
				try {
					let thread = await Thread.findOne({
						users: { $all: args.users },
					});
					if (!thread) {
						console.log("creating thread");
						thread = await new Thread({
							users: args.users,
						});
						let users = await User.find({
							_id: { $in: args.users },
						});
						users[0].threads.push(thread._id);
						users[1].threads.push(thread._id);
						await users[0].save();
						await users[1].save();
						await thread.save();
					}

					thread.messages = thread.messages.slice(-15);
					return thread;
				} catch (err) {
					throw err;
				}
			},
		},
		createMessage: {
			type: MessageType,
			args: {
				from: { type: new GraphQLNonNull(GraphQLID) },
				to: { type: new GraphQLNonNull(GraphQLID) },
				message: { type: new GraphQLNonNull(GraphQLString) },
				thread: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: async (__, args, req) => {
				try {
					let msg = await new Message(args);
					let thread = await Thread.findOne({ _id: args.thread });
					thread.messages.push(msg._id);
					await thread.save();
					await msg.save();

					let io = req.io;
					console.log(msg);
					io.to(args.to).emit("Msg", msg);

					return msg;
				} catch (err) {
					throw err;
				}
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});
