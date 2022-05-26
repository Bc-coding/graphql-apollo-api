const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    tasks(skip: Int, limit: Int): [Task!]
    # tasks(cursor: String, limit: Int): [Task!]
    task(id: ID!): Task
  }

  extend type Mutation {
    createTask(input: createTaskInput!): Task
    updateTask(id: ID!, input: updateTaskInput!): Task
    deleteTask(id: ID!): Task
  }
  ###### TYPE ######
  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
  }
  ###### INPUT #####
  input createTaskInput {
    name: String!
    completed: Boolean!
    # userId: ID!   <--- we don't need this anymore. Once thee user logs in, we could get the userId from the database
  }

  input updateTaskInput {
    name: String
    completed: Boolean
  }
`;
