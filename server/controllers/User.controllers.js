const createError = require('http-errors')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt.helpers");
const User = require('../models/User.model')
const client = require('../helpers/redis.init')


module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const allUsers = await User.find({})

      if (!allUsers) throw createError.NotFound('No users found. Please add new users')
      
      res.status(200).json({
        users: allUsers
      })
    } catch(error) {
      next(error)
    }
  },

  getUser: async (req, res, next) => {
    try {
      // console.log(req.user);
      // TODO: Use the login token to get the user profile back
      const user = await User.findOne({ email: req.user.email });
      if (!user) throw createError.NotFound("User not found");

      res.json({ user: user });
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      console.log(`We hit this route!`)
      console.log(req.body)
      // TODO: Validate the inputs using Joi
      const userExists = await User.findOne({ email: req.body.email })
      if (userExists) throw createError.Conflict(`A user with the email ${req.body.email} exists in the system`)

      const newUser = new User({
        ...req.body
      })

      const savedUser = await newUser.save()

      res.status(201).json({
        message: 'Account created',
        user: savedUser
      })

      
    } catch (error) {
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      // TODO: Validate user inputs
      const { email, password } = req.body

      const _user = await User.findOne({ email: email })
      if (!_user) throw createError.NotFound('You are not registered. You may want to register for an account')

      const passwordMatch = await _user.isValidPassword(password)
      
      if (!passwordMatch) throw createError.Unauthorized('Invalid login credentials')

      const accessToken = await signAccessToken(_user)
      const refreshToken = await signRefreshToken(_user)

      res.header("x-access-token", accessToken).send({
        message: `Login successful!`,
        token: `Bearer ${accessToken}`,
        refreshToken: `Bearer ${refreshToken}`,
      });
      

    } catch (error) {
      next(error)
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      // get user from db
      const user = await User.findOne({ _id: userId });

      const accessToken = await signAccessToken(user);
      const refreshedToken = await signRefreshToken(user);

      res.send({
        token: `Bearer ${accessToken}`,
        refreshToken: `Bearer ${refreshedToken}`,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      // console.log(req.body);
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);

      // console.log(`USER_ID: ${userId}`);
      // Delete the refresh token from Redis
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err);
          throw createError.InternalServerError();
        }

        // console.log(val);
        res.send({
          message: "Logged out!",
        });
      });
    } catch (error) {
      next(error);
    }
  }
}