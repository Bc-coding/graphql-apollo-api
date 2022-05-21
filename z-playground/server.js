import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import dotEnv from "dotenv";
import { tasks, users } from "./constants/index";
import { v4 as uuidv4 } from "uuid";
import { log } from "console";

const typeDefs = gql`
  type Query {
    greetings: [String]!
    tasks: [Task!]
    task(id: ID!): Task
    users: [User]
    user(id: ID!): User
  }

  input createTaskInput {
    name: String!
    completed: Boolean!
    userId: ID!
  }

  type Mutation {
    createTask(input: createTaskInput!): Task
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }

  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    userId: String!
    user: User!
  }
`;

const resolvers = {
  Query: {
    greetings: () => ["Hello", "Hi"],
    tasks: () => {
      console.log(tasks);
      return tasks;
    },
    task: (_, args) => {
      return tasks.find((task) => task.id === args.id);
    },
    users: () => users,
    user: (_, { id }) => users.find((user) => user.id === id),
  },
  Mutation: {
    createTask: (_, { input }) => {
      const task = { ...input, id: uuidv4() };
      tasks.push(task);
      return task;
    },
  },
  Task: {
    user: (parent) => {
      console.log("userId", parent.userId);
      return users.find((user) => user.id === parent.userId);
    },
    // name: () => "test-task",
  },
  User: {
    tasks: (parent) => {
      return tasks.filter((task) => task.userId === parent.id);
    },
  },
};

async function startApolloServer(typeDefs, resolvers) {
  const PORT = process.env.PORT || 4000;
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    context: () => {
      console.log("run!");
      return { email: "test@gmail.com" };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);
