const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { combineResolvers } = require("graphql-resolvers");
const jwt = require("jsonwebtoken");
const { users, tasks } = require("../constants");
// Getting data from database
const User = require("../database/models/user");
const Task = require("../database/models/task");
const Token = require("../database/models/token");
const { isAuthenticated } = require("./middleware");
const bcryptSalt = process.env.BCRYPT_SALT;
const { sendEmail } = require("../utils/email/sendEmail");

module.exports = {
  Query: {
    // users: () => users,
    user: combineResolvers(isAuthenticated, async (_, __, { email }) => {
      try {
        // checking database if the user exists
        const user = await User.findOne({ email });
        // const user = await User.findOne({ email }).populate({ path: "tasks" });
        if (!user) {
          throw new Error("User not found!");
        }
        return user;
      } catch (error) {
        console.log(error);
      }
    }),
  },
  Mutation: {
    signup: async (_, { input }) => {
      try {
        // first, we need to check if the user has already email to avoid duplication.
        const user = await User.findOne({ email: input.email });
        if (user) {
          throw new Error("Email already is use");
        }
        const hashedPassword = await bcrypt.hash(input.password, 12);
        // creating a new instance of the user model
        // then overwrite the password with hashed password
        const newUser = new User({ ...input, password: hashedPassword });
        const result = await newUser.save();
        console.log(result._id, typeof result._id);
        console.log(result.id, typeof result.id);
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(
          input.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect Password");
        }
        const secret = process.env.JWT_SECRET_KEY || "password";
        const token = jwt.sign({ email: user.email }, secret, {
          expiresIn: "1d",
        });

        return { token: token };
      } catch (error) {
        // console.log(error);
        throw new Error("User not found");
      }
    },
    requestPasswordReset: async (_, { email }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User does not exist");
      }
      let token = await Token.findOne({ userId: user._id });
      if (token) await token.deleteOne();

      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

      await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      }).save();

      const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
      sendEmail(
        user.email,
        "Password Reset Request",
        { name: user.name, link: link },
        "./template/requestResetPassword.handlebars"
      );
      return link;
    },
  },
  User: {
    // tasks: ({ id }) => tasks.filter((task) => task.userId === id),
    tasks: async ({ id }) => {
      try {
        const tasks = await Task.find({ user: id });
        return tasks;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
