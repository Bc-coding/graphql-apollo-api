const uuid = require("uuid");
const { combineResolvers } = require("graphql-resolvers");

const { users, tasks } = require("../constants");
const Task = require("../database/models/task");
const User = require("../database/models/user");
const { isAuthenticated, isOwner } = require("./middleware");

module.exports = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_, __, { loggedInUserId }) => {
        try {
          const tasks = await Task.find({ user: loggedInUserId });
          return tasks;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
    task: combineResolvers(isAuthenticated, isOwner, async (_, { id }) => {
      // return tasks.find((task) => task.id === id);
      // We want to check if the person requests the task is the same as the creator
      // the id above is the taskID
      try {
        const task = await Task.findById(id);
        return task;
      } catch (error) {
        console.log(error);

        throw error;
      }
    }),
  },
  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { email }) => {
        // const task = { ...input, id: uuid.v4() };
        // tasks.push(task);
        // return task;    <---- not needed. we will fetch from database

        // Create a new instance of Task using model

        try {
          // checking database if the user exists
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("User not found!");
          }

          const task = new Task({ ...input, user: user._id });
          const result = await task.save(); // saving the created task in the database

          user.tasks.push(result.id);
          await user.save();
          console.log(result);
          return result;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
  },
  Task: {
    user: async (parent) => {
      try {
        const user = await User.findById(parent.user);
        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
