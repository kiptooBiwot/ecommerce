const createError = require('http-errors')


module.exports = {
  getUsers: async (req, res, next) => {
    try {
      res.json({message: 'GET ALL USERS!'})
    } catch(error) {
      next(error)
    }
  }
}