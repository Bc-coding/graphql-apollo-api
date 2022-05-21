const { skip } = require("graphql-resolvers");
const Task = require("../../database/models/task");

module.exports.isAuthenticated = (_, __, { email }) => {
  if (!email) {
    throw new Error("Access denied! Please login to continue,");
  }
  // the skip will call the next resolver
  return skip;
};

module.exports.isOwner = async (_, { id }, { loggedInUserId }) => {
  try {
    const task = await Task.findById(id);
    if (!task) {
      throw new Error("Task not found");
    } else if (task.user.toString() !== loggedInUserId) {
      throw new Error("Not authorized as task owner");
    }
    return skip;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
