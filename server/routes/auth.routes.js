const router = require('express').Router()
const { getUsers } = require('../controllers/User.controllers')


router.get('/', getUsers)

module.exports = router