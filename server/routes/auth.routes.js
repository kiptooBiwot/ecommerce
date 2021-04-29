const router = require('express').Router()
const { getUsers, register, login } = require('../controllers/User.controllers')


router.get('/', getUsers)

router.post('/signup', register)
router.post('/signin', login)

module.exports = router