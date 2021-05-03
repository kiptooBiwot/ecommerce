const { createCategory, getAllCategories } = require('../controllers/Category.controllers')
const { isAdmin, verifyAccessToken } = require('../helpers/jwt.helpers')

const router = require('express').Router()

router.get('/', getAllCategories)
// verifyAccessToken - checks whether user is logged in or not and respons accordingly

router.post('/create', verifyAccessToken, isAdmin, createCategory)

module.exports = router