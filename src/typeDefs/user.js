const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    # users: [User!]
    # user(id: ID!): User
    user: User
  }
  extend type Mutation {
    signup(input: signupInput): User
    login(input: loginInput): Token
    requestPasswordReset(input: requestPasswordResetInput): Token
  }
  ###### TYPE ######
  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
    createdAt: Date!
    updatedAt: Date!
  }

  type Token {
    token: String!
  }

  ###### INPUT #####
  input signupInput {
    name: String!
    email: String!
    password: String!
  }

  input loginInput {
    email: String!
    password: String!
  }

  input requestPasswordResetInput {
    email: String!
  }
`;
