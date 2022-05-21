const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    tasks: [Task!]
    task(id: ID!): Task
  }

  extend type Mutation {
    createTask(input: createTaskInput!): Task
  }
  ###### TYPE ######
  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User
  }
  ###### INPUT #####
  input createTaskInput {
    name: String!
    completed: Boolean!
    # userId: ID!   <--- we don't need this anymore. Once thee user logs in, we could get the userId from the database
  }
`;
