const createError = require('http-errors')
const { signAccessToken, signRefreshToken } = require('../helpers/jwt.helpers')
const User = require('../models/User.model')


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

  register: async (req, res, next) => {
    try {
      console.log(`We hit this route!`)
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
      if (!_user) throw createError.NotFound('You are not registered. You may want to register to get an account')

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
  }
}