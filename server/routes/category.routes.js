const { createCategory, getAllCategories } = require('../controllers/Category.controllers')
const { isAdmin, verifyAccessToken } = require('../helpers/jwt.helpers')
const upload = require('../helpers/multer.helper')

const router = require('express').Router()

router.get('/', getAllCategories)
// verifyAccessToken - checks whether user is logged in or not and respons accordingly

router.post('/create', verifyAccessToken, isAdmin, upload.single('image'), createCategory)

module.exports = router