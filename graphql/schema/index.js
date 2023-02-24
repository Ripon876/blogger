const { buildSchema } = require("graphql");

module.exports = buildSchema(`

		type User {
			_id: ID!
			username: String!
			password: String
			blogs: [Blog!]!
			comments: [Comment!]!
		}

		type Blog {
			_id: ID!
			title: String!
			content: String!
			author: User!
			comments: [Comment!]!
			creation_date: String!
		}

		type Comment {
			_id: ID!
			comment: String!
			blog: Blog!
			author: User!
			creation_date: String!
		} 

		type  RootQuery {
			users: [User!]!
		}


		input UserInput {
			username: String!
			password: String!
		}

		type RootMutation {
			createUser(input: UserInput) : User!
		}

		schema {
			query : RootQuery 
			mutation: RootMutation
		}

`);
