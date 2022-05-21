const { ApolloServer, gql } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");

const resolvers = require("./resolvers/index");
const typeDefs = require("./typeDefs/index");
const mongoose = require("mongoose");
const connection = require("./database/util/index");

const { verifyUser } = require("./helper/context");
const { log } = require("console");

async function startApolloServer(typeDefs, resolvers) {
  const PORT = process.env.PORT || 4000;
  const app = express();

  connection();

  const httpServer = http.createServer(app);

  mongoose.connection.once("open", async () => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      csrfPrevention: true,
      context: async ({ req }) => {
        await verifyUser(req);
        console.log("Context ran ===");
        return {
          email: req.email,
          loggedInUserId: req.loggedInUserId,
        };
      },
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startApolloServer(typeDefs, resolvers);
