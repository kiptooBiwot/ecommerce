const router = require('express').Router()
const { getUsers, register, login, getUser, logout } = require('../controllers/User.controllers')
const { verifyAccessToken } = require('../helpers/jwt.helpers')


router.get('/', getUsers)
router.get('/me', verifyAccessToken, getUser)

router.post('/signup', register)
router.post('/signin', login)
router.delete('/logout', logout)

module.exports = router