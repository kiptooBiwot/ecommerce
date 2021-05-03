const { getCartItems, addItemToCart } = require('../controllers/Cart.controllers')
const { isUser, verifyAccessToken } = require('../helpers/jwt.helpers')

const router = require('express').Router()

router.get('/', getCartItems)

router.post('/', verifyAccessToken, isUser, addItemToCart)

module.exports = router